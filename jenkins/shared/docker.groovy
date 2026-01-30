/*
========================================================================
 docker.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Build Docker images using locked Dockerfiles
 - Optionally push images to a container registry
 - Support Azure ACR using Managed Identity
========================================================================
*/

def build(app, imagesConfig, pushImage = false) {

    stage("Docker Build :: ${app.name}") {

        echo "--------------------------------------------------"
        echo "Docker build started for application : ${app.name}"
        echo "Application type                     : ${app.type}"
        echo "Push image enabled                   : ${pushImage}"
        echo "--------------------------------------------------"

        // --------------------------------------------------
        // Resolve logical image name
        // --------------------------------------------------
        def imageName = imagesConfig.images[app.name]
        if (!imageName) {
            error "❌ No image name defined for ${app.name} in images.yaml"
        }

        // --------------------------------------------------
        // Resolve version & tag
        // --------------------------------------------------
        def appVersion = sh(
            script: "cat ${app.path}/VERSION",
            returnStdout: true
        ).trim()

        def gitSha = sh(
            script: "git rev-parse --short HEAD",
            returnStdout: true
        ).trim()

        def imageTag = "${appVersion}-${gitSha}"

        // --------------------------------------------------
        // Resolve registry details (ONLY WHEN PUSHING)
        // --------------------------------------------------
        def registryUrl = env.REGISTRY_URL

        if (pushImage && !registryUrl) {
            error """
❌ Registry URL not found.

Ensure Jenkins pipeline exports:
- REGISTRY_URL
"""
        }

        // --------------------------------------------------
        // Build full image reference
        // --------------------------------------------------
        def fullImageName = pushImage
            ? "${registryUrl}/${imageName}:${imageTag}"
            : "${imageName}:${imageTag}"

        // --------------------------------------------------
        // Build arguments (frontend only)
        // --------------------------------------------------
        def buildArgs = ""

        if (app.type == 'frontend' && app.buildArgs) {
            echo "Injecting frontend build-time arguments"

            app.buildArgs.each { key, value ->
                if (pushImage && value.startsWith("__")) {
                    error "❌ Unresolved build argument placeholder: ${key}=${value}"
                }
                buildArgs += "--build-arg ${key}=${value} "
            }
        }

        dir(app.path) {
            try {

                // --------------------------------------------------
                // Docker build
                // --------------------------------------------------
                sh """
                    docker build ${buildArgs} \
                      -t ${fullImageName} .
                """

                // --------------------------------------------------
                // Docker push (ACR via Managed Identity)
                // --------------------------------------------------
                if (pushImage) {

                    echo "Authenticating to Azure using Managed Identity"
                    sh "az login --identity"

                    echo "Logging in to Azure Container Registry"
                    sh "az acr login --name ${registryUrl.split('\\.')[0]}"

                    sh "docker push ${fullImageName}"

                } else {
                    echo "Docker image built successfully (verification only)"
                }

            } catch (Exception e) {

                echo "❌ Docker build/push failed for application: ${app.name}"
                echo "Error details: ${e}"

                error """
❌ Docker operation failed for ${app.name}

Please review the logs above to identify the root cause.
"""
            }
        }

        // --------------------------------------------------
        // Expose built image details for GitOps
        // --------------------------------------------------
        def imageWithoutTag = pushImage
            ? "${registryUrl}/${imageName}"
            : "${imageName}"

        app.builtImage = [
            name: imageWithoutTag,
            tag : imageTag
        ]

        echo "✅ Image ready: ${imageWithoutTag}:${imageTag}"
    }
}

return this
