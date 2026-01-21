/*
========================================================================
 docker.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Build Docker images using locked Dockerfiles
 - Optionally push images to a container registry
 - Support Docker Hub now and Azure ACR in future
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
        // Resolve image name (logical name only)
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
        // Resolve registry details (ONLY REQUIRED WHEN PUSHING)
        // --------------------------------------------------
        def registryUrl      = env.REGISTRY_URL
        def repositoryPrefix = env.REPOSITORY_PREFIX
        def credentialsId    = env.REGISTRY_CREDENTIALS_ID

        if (pushImage) {
            if (!registryUrl || !repositoryPrefix || !credentialsId) {
                error """
❌ Registry configuration not found in environment.

Ensure Jenkins pipeline exports:
- REGISTRY_URL
- REPOSITORY_PREFIX
- REGISTRY_CREDENTIALS_ID
"""
            }
        }

        // Build full image name
        def fullImageName = pushImage
            ? "${registryUrl}/${repositoryPrefix}/${imageName}:${imageTag}"
            : "${imageName}:${imageTag}"

        // --------------------------------------------------
        // Build arguments (frontend only)
        // --------------------------------------------------
        def buildArgs = ""

        if (app.type == 'frontend' && app.buildArgs) {
            echo "Injecting frontend build-time arguments"

            app.buildArgs.each { key, value ->
                if (value.startsWith("__")) {
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
                // Docker push (optional)
                // --------------------------------------------------
                if (pushImage) {

                    withCredentials([
                        usernamePassword(
                            credentialsId: credentialsId,
                            usernameVariable: 'REGISTRY_USER',
                            passwordVariable: 'REGISTRY_PASS'
                        )
                    ]) {

                        sh """
                            echo "\$REGISTRY_PASS" | docker login ${registryUrl} \
                              -u "\$REGISTRY_USER" --password-stdin
                        """

                        sh "docker push ${fullImageName}"
                        sh "docker logout ${registryUrl}"
                    }

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
        // Expose built image details to downstream steps
        // --------------------------------------------------
        app.builtImage = [
            name: fullImageName,
            tag : imageTag
        ]

        echo "✅ Image ready: ${fullImageName}"
    }
}

return this
