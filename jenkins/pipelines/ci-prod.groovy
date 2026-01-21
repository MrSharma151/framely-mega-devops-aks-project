/*
========================================================================
 ci-prod.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - CI/CD pipeline for the 'prod' branch
 - Builds, tests, scans, and pushes production images
 - Updates GitOps repository ONLY after manual approval

 SECURITY POLICY (PROD):
 - Trivy scan is ENFORCED
 - Pipeline FAILS only on CRITICAL vulnerabilities
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

    // --------------------------------------------------
    // Resolve environment-specific frontend build values
    // --------------------------------------------------
    // NOTE:
    // apps.yaml remains environment-agnostic.
    // PROD URL should match real production ingress/domain.
    def PROD_API_BASE_URL = "https://api.framely.in/api/v1"

    APPS_CONFIG.apps.each { app ->
        if (app.type == 'frontend' && app.buildArgs) {
            app.buildArgs.each { key, value ->
                if (value == "__API_BASE_URL__") {
                    app.buildArgs[key] = PROD_API_BASE_URL
                }
            }
        }
    }

    echo "=================================================="
    echo " PROD PIPELINE :: CONTROLLED CI + GITOPS DELIVERY"
    echo " Environment        : ${ENVIRONMENT}"
    echo " Registry URL       : ${env.REGISTRY_URL}"
    echo " Repository Prefix  : ${env.REPOSITORY_PREFIX}"
    echo " Frontend API URL   : ${PROD_API_BASE_URL}"
    echo " Security Policy    : Trivy FAILS on CRITICAL only"
    echo " Responsibilities:"
    echo " - Run tests"
    echo " - Run security scans"
    echo " - Build & push Docker images"
    echo " - Run Trivy scan (ENFORCED)"
    echo " - WAIT for manual approval"
    echo " - Update GitOps image tags"
    echo "=================================================="

    // Load shared libraries ONCE
    def testsLib    = load('jenkins/shared/tests.groovy')
    def securityLib = load('jenkins/shared/security.groovy')
    def dockerLib   = load('jenkins/shared/docker.groovy')
    def gitopsLib   = load('jenkins/shared/gitops.groovy')
    def trivyLib    = load('jenkins/shared/trivy.groovy')

    // --------------------------------------------------
    // Run Tests
    // --------------------------------------------------
    stage('Run Tests') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running tests for application: ${app.name}"
            echo "--------------------------------------------------"

            testsLib.run(app)
        }
    }

    // --------------------------------------------------
    // Security & Quality Scans (SCA)
    // --------------------------------------------------
    stage('Security & Quality Scans') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running security scans for application: ${app.name}"
            echo "--------------------------------------------------"

            securityLib.scan(app)
        }
    }

    // --------------------------------------------------
    // Docker Build & Push (Production Images)
    // --------------------------------------------------
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

    // --------------------------------------------------
    // Trivy Image Scan (STRICT)
    // --------------------------------------------------
    stage('Trivy Scan (CRITICAL Enforcement)') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running Trivy scan for application: ${app.name}"
            echo "--------------------------------------------------"

            trivyLib.scan(app, ENVIRONMENT)
        }
    }

    // --------------------------------------------------
    // Manual Approval Gate
    // --------------------------------------------------
    stage('Manual Approval') {
        input message: """
🚨 PRODUCTION RELEASE APPROVAL REQUIRED 🚨

You are about to update the GitOps repository for PROD.

Security checks have passed.

This action will:
- Change production image versions
- Allow ArgoCD to deploy to the PROD AKS cluster

Proceed only after verification and approval.
"""
    }

    // --------------------------------------------------
    // GitOps Update (Prod)
    // --------------------------------------------------
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
