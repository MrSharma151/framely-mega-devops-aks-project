/*
========================================================================
 ci-main.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - CI pipeline for the 'main' branch
 - Performs validation-only checks
 - Ensures code quality before promotion to stage

 DESIGN RULES:
 - Scripted pipeline (loaded from root Jenkinsfile)
 - NO image push
 - NO GitOps updates
 - NO Kubernetes interaction
========================================================================
*/

def run(APPS_CONFIG, IMAGES_CONFIG) {

    // Explicit environment context
    def ENVIRONMENT = 'main'

    echo "=================================================="
    echo " MAIN CI PIPELINE :: VALIDATION ONLY"
    echo " Branch       : ${ENVIRONMENT}"
    echo " Responsibilities:"
    echo " - Run tests"
    echo " - Run security scans"
    echo " - Verify Docker builds (NO PUSH)"
    echo " - Run Trivy scan (REPORT ONLY)"
    echo "=================================================="

    // Load shared libraries once (performance + clarity)
    def testsLib    = load('jenkins/shared/tests.groovy')
    def securityLib = load('jenkins/shared/security.groovy')
    def dockerLib   = load('jenkins/shared/docker.groovy')
    def trivyLib    = load('jenkins/shared/trivy.groovy')

    /*
    ================================================================
    Run Tests
    ------------------------------------------------
    - Executes unit / integration tests for all apps
    - Fails fast if any application test fails
    ================================================================
    */
    stage('Run Tests') {
        echo "Starting test execution for all applications"

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
    ------------------------------------------------
    - Runs basic dependency-level scans
    - Report-only in main branch
    ================================================================
    */
    stage('Security & Quality Scans') {
        echo "Starting security and quality scans"

        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Scanning application: ${app.name}"
            echo "--------------------------------------------------"

            securityLib.scan(app)
        }
    }

    /*
    ================================================================
    Docker Build Verification
    ------------------------------------------------
    - Builds Docker images to validate Dockerfiles
    - Ensures build-time contracts are correct
    - Images are NOT pushed to any registry
    ================================================================
    */
    stage('Docker Build (Verification Only)') {
        echo "Verifying Docker image builds (NO PUSH)"

        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Building Docker image for verification: ${app.name}"
            echo "--------------------------------------------------"

            dockerLib.build(
                app,
                IMAGES_CONFIG,
                false   // false = build only, do NOT push
            )
        }
    }

    /*
    ================================================================
    Trivy Image Scan (REPORT ONLY)
    ------------------------------------------------
    - Scans built images for vulnerabilities
    - Does NOT fail the pipeline
    - Provides early security visibility
    ================================================================
    */
    stage('Trivy Scan (Report Only)') {
        echo "Running Trivy scans in report-only mode"

        APPS_CONFIG.apps.each { app ->
            echo "--------------------------------------------------"
            echo "Running Trivy scan for application: ${app.name}"
            echo "--------------------------------------------------"

            trivyLib.scan(app, ENVIRONMENT)
        }
    }

    echo "=================================================="
    echo " MAIN CI PIPELINE COMPLETED SUCCESSFULLY"
    echo "=================================================="
}

return this
