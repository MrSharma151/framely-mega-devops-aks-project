def build(app, imagesConfig, pushImage = false) {

    stage("Docker Build :: ${app.name}") {

        echo "--------------------------------------------------"
        echo "Docker build started for application: ${app.name}"
        echo "Application type: ${app.type}"
        echo "Push image enabled: ${pushImage}"
        echo "--------------------------------------------------"

        def imageName = imagesConfig.images[app.name]
        if (!imageName) {
            error "❌ No image name defined for ${app.name} in images.yaml"
        }

        def appVersion = sh(
            script: "cat ${app.path}/VERSION",
            returnStdout: true
        ).trim()

        def gitSha = sh(
            script: 'git rev-parse --short HEAD',
            returnStdout: true
        ).trim()

        def imageTag = "${appVersion}-${gitSha}"

        // --------------------------------------------
        // Build args (config-driven, frontend only)
        // --------------------------------------------
        def buildArgs = ""

        if (app.type == 'frontend' && app.buildArgs) {
            echo "Injecting frontend build-time arguments"

            app.buildArgs.each { key, value ->
                buildArgs += "--build-arg ${key}=${value} "
            }
        }

        dir(app.path) {
            try {
                sh """
                    docker build ${buildArgs} -t ${imageName}:${imageTag} .
                """

                if (pushImage) {
                    sh "docker push ${imageName}:${imageTag}"
                } else {
                    echo "Docker image built (verification only)"
                }
            }
            catch (Exception e) {
                error "❌ Docker build failed for ${app.name}"
            }
        }

        app.builtImage = [
            name: imageName,
            tag : imageTag
        ]

        echo "✅ Image ready: ${imageName}:${imageTag}"
    }
}

return this
