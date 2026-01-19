def updateImage(app, environment) {

    stage("GitOps Update :: ${app.name} :: ${environment}") {

        echo "--------------------------------------------------"
        echo "Updating Kubernetes manifests (GitOps)"
        echo "Application : ${app.name}"
        echo "Environment : ${environment}"
        echo "Image       : ${app.builtImage.name}:${app.builtImage.tag}"
        echo "--------------------------------------------------"

        // Root-level kustomization (single source of truth)
        def gitopsPath = "kubernetes/${environment}"

        // IMPORTANT:
        // LEFT side must match deployment.yaml image
        def kustomizeImageName = "framely/${app.name}"

        // Build docker image explicitly (avoid nulls)
        def dockerImage = "${app.builtImage.name}:${app.builtImage.tag}"

        sh """
            echo "Ensuring correct Git branch: ${environment}"
            git fetch origin ${environment}
            git checkout ${environment}
            git pull origin ${environment}
        """

        dir(gitopsPath) {
            sh """
                echo "Updating image mapping in root kustomization.yaml"
                echo "Kustomize Image Name : ${kustomizeImageName}"
                echo "Docker Image         : ${dockerImage}"

                kustomize edit set image \
                  ${kustomizeImageName}=${dockerImage}
            """
        }

        sh """
            git status
            git add kubernetes/${environment}/kustomization.yaml
            git commit -m "gitops(${environment}): update ${app.name} image to ${app.builtImage.tag} [skip ci]"
        """

        withCredentials([
            usernamePassword(
                credentialsId: 'github-pat',
                usernameVariable: 'GIT_USERNAME',
                passwordVariable: 'GIT_TOKEN'
            )
        ]) {
            sh """
                git config user.name "Jenkins"
                git config user.email "jenkins@framely.local"
                git push https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/MrSharma151/framely-aks-mega-devops.git ${environment}
            """
        }

        echo "✅ GitOps image update completed for ${app.name} (${environment})"
    }
}

return this
