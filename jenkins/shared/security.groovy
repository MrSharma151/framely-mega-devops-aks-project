/*
========================================================================
 security.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Perform security and vulnerability scans during CI pipelines
 - Enforce stricter policies as code moves closer to production

 SECURITY POLICY:
 - main  → Report-only mode (does NOT fail pipeline)
 - stage → Enforced (fails on vulnerabilities)
 - prod  → Enforced (fails on vulnerabilities)

 DESIGN PRINCIPLES:
 - Single responsibility: security scanning only
 - Branch-aware enforcement
 - No deployment or GitOps logic
========================================================================
*/

def scan(app) {
    /*
    NOTE:
    This stage is intentionally nested under the caller pipeline stage
    to provide per-application visibility in CI logs.
    */
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
                // SECURITY POLICY ENFORCEMENT
                // --------------------------------------------------
                if (env.BRANCH_NAME == 'main') {
                    echo '''
==================================================
 SECURITY SCAN RESULT (REPORT-ONLY MODE)
--------------------------------------------------
 - Vulnerabilities detected
 - Branch      : main
 - Pipeline    : NOT FAILED
 - Action      : Fix issues before promoting to stage
==================================================
'''
                } else {
                    error """
==================================================
 SECURITY SCAN FAILED (ENFORCED MODE)
--------------------------------------------------
 Application : ${app.name}
 Branch      : ${env.BRANCH_NAME}

 Critical or high severity vulnerabilities detected.
 Pipeline execution stopped to protect downstream environments.
==================================================
"""
                }
            }
        }
    }
}

return this
