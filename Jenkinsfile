/*
========================================================================
 Jenkinsfile
 Framely – Mega DevOps AKS Project

 Purpose:
 - Multibranch pipeline entrypoint
 - Routes execution based on branch
 - Enforces GitOps safety and CI discipline

 NOTE:
 - Jenkins NEVER deploys to Kubernetes
 - Jenkins NEVER modifies manifests directly
 - Jenkins ONLY builds artifacts and updates GitOps state
========================================================================
*/

pipeline {
    agent any

    options {
        // Prevent parallel executions for the same branch
        disableConcurrentBuilds()

        // Add timestamps to logs (production-grade debugging)
        timestamps()

        // Enable ANSI colors for better log readability
        ansiColor('xterm')
    }

    environment {
        PROJECT_NAME = "framely"

        // Centralized Jenkins pipeline directory
        PIPELINES_DIR = "jenkins/pipelines"

        // Centralized config directory
        CONFIG_DIR = "jenkins/config"
    }

    stages {

        /*
        ================================================================
        Checkout Source Code
        ------------------------------------------------
        - Ensures repository is available for all stages
        - Required before reading commit messages or configs
        ================================================================
        */
        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        /*
        ================================================================
        CI Guard Stage (🔥 CRITICAL)
        ------------------------------------------------
        Purpose:
        - Prevent infinite CI loops caused by GitOps commits
        - Skip pipeline execution when commit contains [skip ci]
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
                        echo "🛑 [skip ci] detected. Skipping pipeline execution."
                        currentBuild.result = 'SUCCESS'
                        return
                    }
                }
            }
        }

        /*
        ================================================================
        Branch Validation
        ------------------------------------------------
        Enforces strict branch strategy:
        - main  → CI validation only
        - stage → CI + auto GitOps
        - prod  → CI + manual promotion
        ================================================================
        */
        stage('Branch Validation') {
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
                            Please switch to a valid branch.
                        """.stripIndent())
                    }
                }
            }
        }

        /*
        ================================================================
        Load Pipeline Configuration
        ------------------------------------------------
        - Loads application, image, and registry mappings
        - Keeps Jenkins logic fully config-driven
        ================================================================
        */
        stage('Load Configuration') {
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
        ------------------------------------------------
        Routes execution to branch-specific pipeline logic
        ================================================================
        */
        stage('Pipeline Routing') {
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
            // Ensure clean workspace for next build
            cleanWs()
        }
    }
}
