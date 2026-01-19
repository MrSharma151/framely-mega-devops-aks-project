/*
========================================================================
 ci-stage.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Scripted CI/CD logic for the 'stage' branch
 - Executed from the root Jenkinsfile
 - Build, test, scan, push images, and update GitOps manifests

 Design Rules:
 - NO declarative pipeline here
 - NO agent / options / post blocks
 - ONLY executable stages
 - Jenkins updates Git, ArgoCD deploys
========================================================================
*/

def run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG) {

    echo "=================================================="
    echo "STAGE PIPELINE :: CI + Continuous Deployment"
    echo "Environment : stage"
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
        echo "Running security and quality scans (ENFORCED)"

        APPS_CONFIG.apps.each { app ->
            echo "Scanning application: ${app.name}"

            load('jenkins/shared/security.groovy')
                .scan(app)
        }
    }

    stage('Docker Build & Push') {
        echo "Building and pushing Docker images to STAGE registry"

        APPS_CONFIG.apps.each { app ->
            echo "Building & pushing image for: ${app.name}"

            load('jenkins/shared/docker.groovy')
                .build(app, IMAGES_CONFIG, true)
        }
    }

    stage('GitOps Update (Stage)') {
        echo "Updating GitOps manifests for STAGE environment"

        APPS_CONFIG.apps.each { app ->
            echo "Updating image tag for application: ${app.name}"

            load('jenkins/shared/gitops.groovy')
                .updateImage(app, 'stage')
        }
    }

    echo "✅ STAGE pipeline completed successfully"
    echo "ArgoCD will automatically sync changes to the STAGE cluster"
}

return this
