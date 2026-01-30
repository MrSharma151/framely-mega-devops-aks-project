/*
========================================================================
 gitops.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Update Kubernetes manifests via GitOps
 - Modify image tags in Kustomize configuration
 - Trigger ArgoCD reconciliation (indirectly)
========================================================================
*/

def updateImage(app, environment) {

    stage("GitOps Update :: ${app.name} :: ${environment}") {

        // --------------------------------------------------
        // Defensive checks
        // --------------------------------------------------
        if (!app.builtImage) {
            error """
❌ No built image metadata found for application: ${app.name}

Ensure Docker build & push stage completed successfully
before attempting GitOps update.
"""
        }

        echo "--------------------------------------------------"
        echo "Starting GitOps image update"
        echo "Application : ${app.name}"
        echo "Environment : ${environment}"
        echo "Image       : ${app.builtImage.name}:${app.builtImage.tag}"
        echo "--------------------------------------------------"

        // --------------------------------------------------
        // GitOps repository structure
        // --------------------------------------------------
        def gitopsPath = "kubernetes/${environment}"

        // --------------------------------------------------
        // Kustomize image handling (CRITICAL FIX)
        //
        // LEFT  = logical image name (MUST match deployment.yaml)
        // RIGHT = full image with registry + tag
        // --------------------------------------------------

        // Example:
        // app.builtImage.name = acrframelystage.azurecr.io/framely-backend
        // logicalImageName   = framely-backend
        def logicalImageName = app.builtImage.name.tokenize('/').last()
        def fullImageWithTag = "${app.builtImage.name}:${app.builtImage.tag}"

        // --------------------------------------------------
        // Ensure correct Git branch
        // --------------------------------------------------
        sh """
            echo "Switching to GitOps branch: ${environment}"
            git fetch origin ${environment}
            git checkout ${environment}
            git pull origin ${environment}
        """

        // --------------------------------------------------
        // Update Kustomize image mapping (REPLACE, NOT APPEND)
        // --------------------------------------------------
        dir(gitopsPath) {
            sh """
                echo "Updating image in kustomization.yaml"
                echo "Logical Image Name : ${logicalImageName}"
                echo "Full Docker Image  : ${fullImageWithTag}"

                kustomize edit set image \
                  ${logicalImageName}=${fullImageWithTag}
            """
        }

        // --------------------------------------------------
        // Commit GitOps change
        // --------------------------------------------------
        sh """
            git config user.name "Jenkins"
            git config user.email "jenkins@framely.local"

            git status
            git add kubernetes/${environment}/kustomization.yaml
            git commit -m "gitops(${environment}): update ${app.name} image to ${app.builtImage.tag} [skip ci]"
        """

        // --------------------------------------------------
        // Push changes using GitHub PAT
        // --------------------------------------------------
        withCredentials([
            usernamePassword(
                credentialsId: 'github-pat',
                usernameVariable: 'GIT_USERNAME',
                passwordVariable: 'GIT_TOKEN'
            )
        ]) {
            sh """
                git push https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/MrSharma151/framely-aks-mega-devops.git ${environment}
            """
        }

        echo "✅ GitOps image update completed for ${app.name} (${environment})"
    }
}

return this
