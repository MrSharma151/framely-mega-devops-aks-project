def scan(app) {

    stage("Security Scan :: ${app.name}") {

        echo "--------------------------------------------------"
        echo "Running security scans for application: ${app.name}"
        echo "Application path: ${app.path}"
        echo "Branch           : ${env.BRANCH_NAME}"
        echo "--------------------------------------------------"

        dir(app.path) {

            try {

                // -------------------------------
                // Backend (.NET)
                // -------------------------------
                if (app.name == 'backend') {

                    sh '''
                        dotnet list Framely/Framely.sln package --vulnerable
                    '''
                }

                // -------------------------------
                // Frontend / Node.js
                // -------------------------------
                else {

                    if (!app.securityCommand) {
                        echo "⚠️ No securityCommand defined. Skipping."
                        return
                    }

                    sh """
                        ${app.securityCommand}
                    """
                }

            }
            catch (Exception e) {

                // ===============================
                // SECURITY POLICY ENFORCEMENT
                // ===============================
                if (env.BRANCH_NAME == 'main') {

                    echo """
                    ⚠️ SECURITY ISSUES DETECTED (main branch)

                    - Vulnerabilities found during scan
                    - Pipeline NOT failing (report-only mode)
                    - Must be fixed before promoting to stage
                    """

                } else {

                    error """
                    ❌ Security scan failed for application: ${app.name}

                    Branch: ${env.BRANCH_NAME}
                    Critical or high severity issues detected.
                    """
                }
            }
        }
    }
}

return this
