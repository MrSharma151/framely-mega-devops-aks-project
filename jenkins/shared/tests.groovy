def run(app) {

    stage("Tests :: ${app.name}") {

        echo "--------------------------------------------------"
        echo "Running tests for application: ${app.name}"
        echo "Application path: ${app.path}"
        echo "--------------------------------------------------"

        dir(app.path) {

            try {

                // Backend (.NET)
                if (app.name == 'backend') {

                    echo "Detected .NET backend application"
                    sh '''
                        dotnet test Framely/Framely.sln
                    '''

                }
                // Frontend / Node.js apps
                else {

                    if (!app.testCommand) {
                        error "❌ No testCommand defined for ${app.name} in apps.yaml"
                    }

                    echo "Installing Node.js dependencies (CI mode)"
                    sh '''
                        npm ci
                    '''

                    echo "Executing test command: ${app.testCommand}"
                    sh """
                        ${app.testCommand}
                    """
                }

            } catch (Exception e) {
                error """
                ❌ Tests failed for application: ${app.name}

                Please check the test logs above.
                Pipeline execution stopped.
                """
            }
        }
    }
}

return this
