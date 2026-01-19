/*
========================================================================
 Jenkinsfile
 Framely – Mega DevOps AKS Project
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
        JENKINS_DIR  = "jenkins/pipelines"
    }

    stages {

        /*
        ================================================================
        CI GUARD STAGE (🔥 MOST IMPORTANT)
        ------------------------------------------------
        Purpose:
        - Prevent infinite CI loop caused by GitOps commits
        - Skip pipeline execution if commit message contains [skip ci]
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
                        echo "🛑 GitOps commit detected ([skip ci]). Skipping pipeline execution."
                        currentBuild.result = 'SUCCESS'
                        return
                    }
                }
            }
        }

        stage('Branch Validation') {
            steps {
                script {
                    echo "Running pipeline for branch: ${env.BRANCH_NAME}"

                    def allowedBranches = ['main', 'stage', 'prod']
                    if (!allowedBranches.contains(env.BRANCH_NAME)) {
                        error("""
❌ Invalid branch '${env.BRANCH_NAME}'

Allowed branches:
- main   (CI validation only)
- stage  (CI + auto GitOps)
- prod   (CI + manual delivery)
""")
                    }
                }
            }
        }

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Load Configuration') {
            steps {
                script {
                    echo "Loading pipeline configuration"

                    APPS_CONFIG       = readYaml file: 'jenkins/config/apps.yaml'
                    IMAGES_CONFIG     = readYaml file: 'jenkins/config/images.yaml'
                    REGISTRIES_CONFIG = readYaml file: 'jenkins/config/registries.yaml'

                    echo "Apps detected: ${APPS_CONFIG.apps*.name}"
                }
            }
        }

        stage('Pipeline Routing') {
            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {
                        echo "Routing to MAIN CI pipeline"
                        load("${JENKINS_DIR}/ci-main.groovy")
                            .run(APPS_CONFIG, IMAGES_CONFIG)
                    }

                    else if (env.BRANCH_NAME == 'stage') {
                        echo "Routing to STAGE pipeline"
                        load("${JENKINS_DIR}/ci-stage.groovy")
                            .run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG)
                    }

                    else if (env.BRANCH_NAME == 'prod') {
                        echo "Routing to PROD pipeline"
                        load("${JENKINS_DIR}/ci-prod.groovy")
                            .run(APPS_CONFIG, IMAGES_CONFIG, REGISTRIES_CONFIG)
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
