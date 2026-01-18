/*
========================================================================
 ci-main.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Scripted CI logic for the 'main' branch
 - Executed from the root Jenkinsfile
 - Performs validation-only CI checks

 Design Rules:
 - NO declarative pipeline here
 - NO agent / options / post blocks
 - ONLY executable stages
========================================================================
*/

def run(APPS_CONFIG, IMAGES_CONFIG) {

    echo "=================================================="
    echo "MAIN CI PIPELINE :: Validation Only"
    echo "Environment : main"
    echo "=================================================="

    stage('Run Tests') {
        echo "Running unit and integration tests"

        APPS_CONFIG.apps.each { app ->
            echo "Executing tests for application: ${app.name}"

            load('jenkins/shared/tests.groovy')
                .run(app)
        }
    }

    stage('Security & Quality Scans') {
        echo "Running security and quality scans"

        APPS_CONFIG.apps.each { app ->
            echo "Scanning application: ${app.name}"

            load('jenkins/shared/security.groovy')
                .scan(app)
        }
    }

    stage('Docker Build (Verification Only)') {
        echo "Building Docker images (verification only)"

        APPS_CONFIG.apps.each { app ->
            echo "Building Docker image for: ${app.name}"

            load('jenkins/shared/docker.groovy')
                .build(app, IMAGES_CONFIG, false)
        }
    }

    echo "✅ MAIN CI validation completed successfully"
}

return this
