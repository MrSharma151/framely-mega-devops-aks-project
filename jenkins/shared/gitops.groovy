def updateImage(app, environment) {

    stage("GitOps Update :: ${app.name} :: ${environment}") {

        echo "--------------------------------------------------"
        echo "Updating Kubernetes manifests (GitOps)"
        echo "Application : ${app.name}"
        echo "Environment : ${environment}"
        echo "Image       : ${app.builtImage.name}:${app.builtImage.tag}"
        echo "--------------------------------------------------"

        // 🔑 Root-level kustomization (single source of truth)
        def gitopsPath = "kubernetes/${environment}"

        // Ensure we are on the correct branch
        sh """
            echo "Ensuring correct Git branch: ${environment}"
            git fetch origin ${environment}
            git checkout ${environment}
            git pull origin ${environment}
        """

        // Update image tag in ROOT kustomization.yaml
        dir(gitopsPath) {
            sh """
                echo "Updating image tag in root kustomization.yaml"

                kustomize edit set image \
                  ${app.builtImage.name}=${app.builtImage.name}:${app.builtImage.tag}
            """
        }

        // Commit ONLY root kustomization
        sh """
            git status
            git add kubernetes/${environment}/kustomization.yaml
            git commit -m "gitops(${environment}): update ${app.name} image to ${app.builtImage.tag} [skip ci]"
        """

        // Push changes
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
