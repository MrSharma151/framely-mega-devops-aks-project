/*
========================================================================
 security.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Centralized security and quality scanning logic
 - Run dependency and static analysis checks per application
 - Ensure security issues are detected early (shift-left)

 Design Principles:
 - Tool-agnostic (can plug Trivy, Snyk, Sonar later)
 - Config-driven with minimal app-specific logic
 - Fail-fast on critical issues
========================================================================
*/

def scan(app) {

    stage("Security Scan :: ${app.name}") {

        echo "--------------------------------------------------"
        echo "Running security scans for application: ${app.name}"
        echo "Application path: ${app.path}"
        echo "--------------------------------------------------"

        dir(app.path) {

            try {

                /*
                 * Backend (.NET) security scan
                 * - Multi-project solution
                 * - Dependency vulnerabilities scanned via solution file
                 */
                if (app.name == 'backend') {

                    echo "Detected .NET backend application"
                    echo "Scanning dependencies via solution file"

                    sh '''
                        dotnet list Framely/Framely.sln package --vulnerable
                    '''
                }
                /*
                 * All other applications (Node.js, etc.)
                 * - Command defined in apps.yaml
                 */
                else {

                    if (!app.securityCommand) {
                        echo "⚠️ No securityCommand defined for ${app.name}. Skipping scan."
                        return
                    }

                    echo "Executing security scan: ${app.securityCommand}"

                    sh """
                        ${app.securityCommand}
                    """
                }

            } catch (Exception e) {
                error """
                ❌ Security scan failed for application: ${app.name}

                Critical or high severity issues detected.
                Please review the scan output above.
                """
            }
        }
    }
}

return this
