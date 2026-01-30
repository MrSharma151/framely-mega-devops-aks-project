/*
========================================================================
 security.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Perform security and vulnerability scans during CI pipelines
 - Enforce stricter policies as code moves closer to production

 SECURITY POLICY (CURRENT STATE):
 - main  → Report-only mode
 - stage → Report-only mode
 - prod  → Report-only mode (TEMPORARY – infra not provisioned)

 FUTURE STATE:
 - prod  → Enforced (fail on CRITICAL/HIGH vulnerabilities)

 DESIGN PRINCIPLES:
 - Single responsibility: security scanning only
 - Branch-aware enforcement
 - No deployment or GitOps logic
========================================================================
*/

def scan(app) {

    stage("Security Scan :: ${app.name}") {

        echo '--------------------------------------------------'
        echo "Starting security scan for application: ${app.name}"
        echo "Application path : ${app.path}"
        echo "Branch           : ${env.BRANCH_NAME}"
        echo '--------------------------------------------------'

        dir(app.path) {
            try {

                // --------------------------------------------------
                // Backend Application (.NET)
                // --------------------------------------------------
                if (app.name == 'backend') {
                    echo 'Detected backend application (.NET)'
                    echo 'Running .NET dependency vulnerability scan'

                    sh '''
                        dotnet list Framely/Framely.sln package --vulnerable
                    '''
                }

                // --------------------------------------------------
                // Frontend Applications (Node.js / Next.js)
                // --------------------------------------------------
                else {
                    if (!app.securityCommand) {
                        echo "⚠️ No securityCommand defined for ${app.name}. Skipping security scan."
                        return
                    }

                    echo 'Detected frontend application (Node.js)'
                    echo "Executing security command: ${app.securityCommand}"

                    sh """
                        ${app.securityCommand}
                    """
                }

            } catch (Exception e) {

                echo "⚠️ Security issues detected for application: ${app.name}"
                echo "Error details: ${e}"

                // --------------------------------------------------
                // TEMPORARY REPORT-ONLY MODE (ALL BRANCHES)
                // --------------------------------------------------
                echo """
==================================================
 SECURITY SCAN RESULT (REPORT-ONLY MODE)
--------------------------------------------------
 Application : ${app.name}
 Branch      : ${env.BRANCH_NAME}

 - Vulnerabilities detected
 - Pipeline NOT failed
 - Reason   : Production infrastructure not provisioned yet
 - Action   : Enforce policy once real PROD is live
==================================================
"""
            }
        }
    }
}

return this
