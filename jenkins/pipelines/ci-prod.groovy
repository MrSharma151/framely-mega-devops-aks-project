/*
========================================================================
 ci-prod.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - CI/CD pipeline for the 'prod' branch
 - Builds, tests, scans, and pushes production images
 - Updates GitOps repository ONLY after manual approval

 KEY PRINCIPLES:
 - Scripted pipeline (loaded from root Jenkinsfile)
 - Jenkins NEVER deploys to Kubernetes
 - Jenkins ONLY updates Git (GitOps)
 - Production rollout is approval-controlled
 - ArgoCD sync is manually triggered in PROD
========================================================================
*/

def run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG) {

    // --------------------------------------------------
    // Explicit environment context
    // --------------------------------------------------
    def ENVIRONMENT = 'prod'

    // --------------------------------------------------
    // Resolve registry configuration for PROD
    // --------------------------------------------------
    def registry = REGISTRIES_CONFIG.registries[ENVIRONMENT]
    if (!registry) {
        error "❌ No registry configuration found for environment: ${ENVIRONMENT}"
    }

    // Export registry details for docker.groovy
    env.REGISTRY_URL            = registry.registryUrl
    env.REPOSITORY_PREFIX       = registry.repositoryPrefix
    env.REGISTRY_CREDENTIALS_ID = registry.credentialsId

    echo "=================================================="
    echo " PROD PIPELINE :: CONTROLLED CI + GITOPS DELIVERY"
    echo " Environment        : ${ENVIRONMENT}"
    echo " Registry URL       : ${env.REGISTRY_URL}"
    echo " Repository Prefix  : ${env.REPOSITORY_PREFIX}"
    echo " Responsibilities:"
    echo " - Run tests"
    echo " - Run security scans"
    echo " - Build & push Docker images"
    echo " - WAIT for manual approval"
    echo " - Update GitOps image tags"
    echo "=================================================="

    // Load shared libraries ONCE
    def testsLib    = load('jenkins/shared/tests.groovy')
    def securityLib = load('jenkins/shared/security.groovy')
    def dockerLib   = load('jenkins/shared/docker.groovy')
    def gitopsLib   = load('jenkins/shared/gitops.groovy')

    /*
    ================================================================
    Run Tests
    ================================================================
    */
    stage('Run Tests') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running tests for application: ${app.name}"
            echo "--------------------------------------------------"

            testsLib.run(app)
        }
    }

    /*
    ================================================================
    Security & Quality Scans
    ================================================================
    */
    stage('Security & Quality Scans') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running security scans for application: ${app.name}"
            echo "--------------------------------------------------"

            securityLib.scan(app)
        }
    }

    /*
    ================================================================
    Docker Build & Push (Production Images)
    ================================================================
    */
    stage('Docker Build & Push') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Building & pushing PRODUCTION image for: ${app.name}"
            echo "Target environment: ${ENVIRONMENT}"
            echo "--------------------------------------------------"

            dockerLib.build(
                app,
                IMAGES_CONFIG,
                true    // build + push
            )
        }
    }

    /*
    ================================================================
    Manual Approval Gate (Production Release)
    ================================================================
    */
    stage('Manual Approval') {
        input message: """
🚨 PRODUCTION RELEASE APPROVAL REQUIRED 🚨

You are about to update the GitOps repository for PROD.

This action will:
- Change production image versions
- Allow ArgoCD to deploy to the PROD AKS cluster

Please confirm that:
✔ Tests and scans have passed
✔ Images are verified
✔ Change is approved

Do you want to proceed?
"""
    }

    /*
    ================================================================
    GitOps Update (Prod)
    ================================================================
    */
    stage('GitOps Update (Prod)') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Updating GitOps image tag for: ${app.name}"
            echo "Environment: ${ENVIRONMENT}"
            echo "--------------------------------------------------"

            gitopsLib.updateImage(app, ENVIRONMENT)
        }
    }

    echo "=================================================="
    echo " PROD PIPELINE COMPLETED SUCCESSFULLY"
    echo " GitOps repository updated for PROD"
    echo " ArgoCD deployment requires MANUAL sync"
    echo "=================================================="
}

return this
