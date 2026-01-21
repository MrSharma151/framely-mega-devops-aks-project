/*
========================================================================
 ci-stage.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - CI/CD pipeline for the 'stage' branch
 - Builds, tests, scans, pushes images
 - Updates GitOps repository (image tags only)

 SECURITY POLICY (STAGE):
 - Trivy scan is REPORT-ONLY
 - Vulnerabilities are visible but NOT blocking
========================================================================
*/

def run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG) {

    // --------------------------------------------------
    // Explicit environment context
    // --------------------------------------------------
    def ENVIRONMENT = 'stage'

    // --------------------------------------------------
    // Resolve registry configuration for STAGE
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
    // Environment binding happens here by design.
    def STAGE_API_BASE_URL = "http://localhost:8081/api/v1"

    APPS_CONFIG.apps.each { app ->
        if (app.type == 'frontend' && app.buildArgs) {
            app.buildArgs.each { key, value ->
                if (value == "__API_BASE_URL__") {
                    app.buildArgs[key] = STAGE_API_BASE_URL
                }
            }
        }
    }

    echo "=================================================="
    echo " STAGE PIPELINE :: CI + GITOPS DELIVERY"
    echo " Environment        : ${ENVIRONMENT}"
    echo " Registry URL       : ${env.REGISTRY_URL}"
    echo " Repository Prefix  : ${env.REPOSITORY_PREFIX}"
    echo " Frontend API URL   : ${STAGE_API_BASE_URL}"
    echo " Security Policy    : Trivy REPORT-ONLY"
    echo " Responsibilities:"
    echo " - Run tests"
    echo " - Run security scans"
    echo " - Build & push Docker images"
    echo " - Run Trivy image scan (non-blocking)"
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
    // Docker Build & Push
    // --------------------------------------------------
    stage('Docker Build & Push') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Building & pushing Docker image for: ${app.name}"
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
    // Trivy Image Scan (REPORT ONLY)
    // --------------------------------------------------
    stage('Trivy Scan (Report Only)') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running Trivy scan for application: ${app.name}"
            echo "--------------------------------------------------"

            trivyLib.scan(app, ENVIRONMENT)
        }
    }

    // --------------------------------------------------
    // GitOps Update (Stage)
    // --------------------------------------------------
    stage('GitOps Update (Stage)') {
        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Updating GitOps image tag for: ${app.name}"
            echo "Environment: ${ENVIRONMENT}"
            echo "--------------------------------------------------"

            gitopsLib.updateImage(app, ENVIRONMENT)
        }
    }

    echo "=================================================="
    echo " STAGE PIPELINE COMPLETED SUCCESSFULLY"
    echo " GitOps repository updated"
    echo " ArgoCD will automatically deploy to STAGE AKS"
    echo "=================================================="
}

return this
