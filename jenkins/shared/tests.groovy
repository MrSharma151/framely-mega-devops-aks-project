/*
========================================================================
 tests.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Execute application-level tests during CI pipelines
 - Supports backend (.NET) and frontend (Node.js / Next.js) apps

 DESIGN PRINCIPLES:
 - Single responsibility: test execution only
 - Fail fast on test failures
 - No Docker, GitOps, or environment-specific logic
========================================================================
*/

def run(app) {

    /*
    NOTE:
    This stage is intentionally nested under the caller pipeline stage
    (e.g., "Run Tests") to provide per-application visibility in logs.
    */
    stage("Tests :: ${app.name}") {

        echo "--------------------------------------------------"
        echo "Starting tests for application: ${app.name}"
        echo "Application path            : ${app.path}"
        echo "--------------------------------------------------"

        dir(app.path) {

            try {

                // --------------------------------------------------
                // Backend Application (.NET)
                // --------------------------------------------------
                if (app.name == 'backend') {

                    echo "Detected backend application (.NET)"
                    echo "Executing: dotnet test"

                    sh '''
                        dotnet test Framely/Framely.sln
                    '''
                }

                // --------------------------------------------------
                // Frontend Applications (Node.js / Next.js)
                // --------------------------------------------------
                else {

                    if (!app.testCommand) {
                        error "❌ No testCommand defined for ${app.name} in apps.yaml"
                    }

                    echo "Detected frontend application (Node.js)"
                    echo "Installing dependencies using npm ci"

                    sh '''
                        npm ci
                    '''

                    echo "Executing test command: ${app.testCommand}"

                    sh """
                        ${app.testCommand}
                    """
                }

            } catch (Exception e) {

                echo "❌ Test execution failed for application: ${app.name}"
                echo "Error details: ${e}"

                error """
                    ❌ Tests failed for application: ${app.name}

                        Please review the logs above to identify the root cause.
                        Pipeline execution has been stopped to prevent faulty artifacts.
                    """
            }
        }
    }
}

return this
