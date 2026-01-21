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

    echo "=================================================="
    echo " MAIN CI PIPELINE :: VALIDATION ONLY"
    echo " Branch       : main"
    echo " Responsibilities:"
    echo " - Run tests"
    echo " - Run security scans"
    echo " - Verify Docker builds (NO PUSH)"
    echo "=================================================="

    // Load shared libraries once (performance + clarity)
    def testsLib    = load('jenkins/shared/tests.groovy')
    def securityLib = load('jenkins/shared/security.groovy')
    def dockerLib   = load('jenkins/shared/docker.groovy')

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
    - Runs basic security and quality checks
    - Helps catch vulnerable dependencies early
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

    echo "=================================================="
    echo " MAIN CI PIPELINE COMPLETED SUCCESSFULLY"
    echo "=================================================="
}

return this
