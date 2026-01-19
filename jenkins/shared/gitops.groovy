def updateImage(app, environment) {

    stage("GitOps Update :: ${app.name} :: ${environment}") {

        echo "--------------------------------------------------"
        echo "Updating Kubernetes manifests (GitOps)"
        echo "Application : ${app.name}"
        echo "Environment : ${environment}"
        echo "Image       : ${app.builtImage.name}:${app.builtImage.tag}"
        echo "--------------------------------------------------"

        def gitopsPath = "kubernetes/${environment}/${app.name}"

        // Ensure we are on the correct branch (avoid detached HEAD)
        sh """
            echo "Ensuring correct Git branch: ${environment}"
            git fetch origin ${environment}
            git checkout ${environment}
            git pull origin ${environment}
        """

        // Update image tag using Kustomize
        dir(gitopsPath) {
            sh """
                echo "Updating image tag in kustomization.yaml"
                kustomize edit set image \
                  ${app.builtImage.name}=${app.builtImage.name}:${app.builtImage.tag}
            """
        }

        // Commit changes
        sh """
            git status
            git add kubernetes/${environment}/${app.name}
            git commit -m "gitops(${environment}): update ${app.name} image to ${app.builtImage.tag}"
        """

        // 🔐 Push using Jenkins GitHub credentials (PAT)
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

        echo "✅ GitOps update completed for ${app.name} (${environment})"
    }
}

return this
