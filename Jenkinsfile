/*
========================================================================
 Jenkinsfile
 Framely – Mega DevOps AKS Project

 Purpose:
 - Multibranch pipeline entrypoint
 - Routes execution based on branch
 - Enforces GitOps safety and CI discipline

 KEY GUARANTEE:
 - GitOps commits containing [skip ci] will NEVER re-trigger pipelines
========================================================================
*/

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        ansiColor('xterm')
    }

    environment {
        PROJECT_NAME = "framely"

        PIPELINES_DIR = "jenkins/pipelines"
        CONFIG_DIR    = "jenkins/config"

        // CRITICAL FLAG TO STOP GITOPS LOOPS
        SKIP_CI = "false"
    }

    stages {

        /*
        ================================================================
        Checkout Source Code
        ================================================================
        */
        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        /*
        ================================================================
        CI Guard (🔥 LOOP BREAKER)
        ================================================================
        */
        stage('CI Guard') {
            steps {
                script {
                    def commitMessage = sh(
                        script: "git log -1 --pretty=%B",
                        returnStdout: true
                    ).trim()

                    echo "Last commit message:"
                    echo commitMessage

                    if (commitMessage.contains('[skip ci]')) {
                        echo "🛑 [skip ci] detected. Marking build to be skipped."
                        env.SKIP_CI = "true"
                    }
                }
            }
        }

        /*
        ================================================================
        Branch Validation
        ================================================================
        */
        stage('Branch Validation') {
            when {
                expression { env.SKIP_CI != "true" }
            }
            steps {
                script {
                    echo "Running pipeline for branch: ${env.BRANCH_NAME}"

                    def allowedBranches = ['main', 'stage', 'prod']

                    if (!allowedBranches.contains(env.BRANCH_NAME)) {
                        error("""
❌ Invalid branch '${env.BRANCH_NAME}'

Allowed branches:
- main   → CI validation only
- stage  → CI + auto GitOps update
- prod   → CI + manual promotion
""")
                    }
                }
            }
        }

        /*
        ================================================================
        Load Configuration
        ================================================================
        */
        stage('Load Configuration') {
            when {
                expression { env.SKIP_CI != "true" }
            }
            steps {
                script {
                    echo "Loading Jenkins pipeline configuration files"

                    APPS_CONFIG       = readYaml file: "${CONFIG_DIR}/apps.yaml"
                    IMAGES_CONFIG     = readYaml file: "${CONFIG_DIR}/images.yaml"
                    REGISTRIES_CONFIG = readYaml file: "${CONFIG_DIR}/registries.yaml"

                    if (!APPS_CONFIG || !IMAGES_CONFIG) {
                        error("❌ Failed to load mandatory Jenkins configuration files")
                    }

                    echo "Configuration loaded successfully"
                }
            }
        }

        /*
        ================================================================
        Pipeline Routing
        ================================================================
        */
        stage('Pipeline Routing') {
            when {
                expression { env.SKIP_CI != "true" }
            }
            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {
                        echo "Routing to MAIN CI pipeline"
                        load("${PIPELINES_DIR}/ci-main.groovy")
                            .run(APPS_CONFIG, IMAGES_CONFIG)
                    }

                    else if (env.BRANCH_NAME == 'stage') {
                        echo "Routing to STAGE CI/CD pipeline"
                        load("${PIPELINES_DIR}/ci-stage.groovy")
                            .run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG)
                    }

                    else if (env.BRANCH_NAME == 'prod') {
                        echo "Routing to PROD CI/CD pipeline (manual gate enabled)"
                        load("${PIPELINES_DIR}/ci-prod.groovy")
                            .run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG)
                    }

                    else {
                        error("❌ No pipeline mapped for branch: ${env.BRANCH_NAME}")
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully for branch: ${env.BRANCH_NAME}"
        }

        failure {
            echo "❌ Pipeline failed for branch: ${env.BRANCH_NAME}"
        }

        always {
            cleanWs()
        }
    }
}
