def updateImage(app, environment) {

    stage("GitOps Update :: ${app.name} :: ${environment}") {

        echo "--------------------------------------------------"
        echo "Updating Kubernetes manifests (GitOps)"
        echo "Application : ${app.name}"
        echo "Environment : ${environment}"
        echo "Docker Image: ${app.builtImage.full}"
        echo "--------------------------------------------------"

        // 🔑 Root-level kustomization (single source of truth)
        def gitopsPath = "kubernetes/${environment}"

        /*
         * IMPORTANT:
         * - LEFT side (kustomizeImageName) MUST match deployment.yaml image
         * - RIGHT side (builtImage.full) is the real Docker image
         *
         * Example:
         *   deployment.yaml -> image: framely/backend
         *   kustomize edit  -> framely/backend=mrsharma151/framely-backend:1.0.x
         */
        def kustomizeImageName = "framely/${app.name}"

        // Ensure correct branch
        sh """
            echo "Ensuring correct Git branch: ${environment}"
            git fetch origin ${environment}
            git checkout ${environment}
            git pull origin ${environment}
        """

        // Update image in ROOT kustomization.yaml (UPDATE, not append)
        dir(gitopsPath) {
            sh """
                echo "Updating image mapping in root kustomization.yaml"
                echo "Kustomize Image Name : ${kustomizeImageName}"
                echo "Docker Image         : ${app.builtImage.full}"

                kustomize edit set image \
                  ${kustomizeImageName}=${app.builtImage.full}
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

        echo "✅ GitOps image update completed for ${app.name} (${environment})"
    }
}

return this
