/*
========================================================================
 trivy.groovy
 Framely – Mega DevOps AKS Project

 Purpose:
 - Perform container image vulnerability scanning using Trivy
 - Enforce security policies based on branch/environment
 - Fail builds only where appropriate (stage/prod)

 WHY TRIVY:
 - Lightweight, fast, and industry-standard
 - No external service dependency
 - Excellent fit for AKS and GitOps workflows

 DESIGN PRINCIPLES:
 - Report-only in main branch (no enforcement)
 - Enforced scanning in stage environment
 - Strict enforcement in prod environment
 - Jenkins NEVER fixes vulnerabilities, only reports/enforces
========================================================================
*/

def scan(app, environment) {

    stage("Trivy Scan :: ${app.name}") {

        // --------------------------------------------------
        // Defensive checks
        // --------------------------------------------------
        if (!app.builtImage) {
            error """
❌ Trivy scan skipped: No built image found for ${app.name}

Ensure Docker build stage runs before Trivy scan.
"""
        }

        def imageName = app.builtImage.name
        def imageTag  = app.builtImage.tag
        def fullImage = "${imageName}:${imageTag}"

        echo "--------------------------------------------------"
        echo "Starting Trivy vulnerability scan"
        echo "Application : ${app.name}"
        echo "Environment : ${environment}"
        echo "Image       : ${fullImage}"
        echo "--------------------------------------------------"

        // --------------------------------------------------
        // Define security policy per environment
        // --------------------------------------------------
        def severityLevels = ""
        def failBuild      = false

        switch (environment) {

            case 'main':
                // Report-only mode (developer feedback)
                severityLevels = "CRITICAL,HIGH,MEDIUM,LOW"
                failBuild = false
                break

            case 'stage':
                // Enforced security gate
                severityLevels = "CRITICAL,HIGH"
                failBuild = true
                break

            case 'prod':
                // Strict production policy
                severityLevels = "CRITICAL,HIGH"
                failBuild = true
                break

            default:
                error "❌ Unknown environment '${environment}' for Trivy scan"
        }

        echo "Trivy severity threshold : ${severityLevels}"
        echo "Fail build on findings   : ${failBuild}"

        // --------------------------------------------------
        // Execute Trivy scan
        // --------------------------------------------------
        try {

            sh """
                trivy image \
                  --no-progress \
                  --severity ${severityLevels} \
                  ${fullImage}
            """

            echo "✅ Trivy scan completed for ${app.name}"

        } catch (Exception e) {

            if (!failBuild) {

                echo """
⚠️ Trivy detected vulnerabilities (report-only mode)

Environment : ${environment}
Application : ${app.name}
Image       : ${fullImage}

Pipeline is NOT failing.
Issues must be addressed before promotion to STAGE.
"""

            } else {

                error """
❌ Trivy scan FAILED

Environment : ${environment}
Application : ${app.name}
Image       : ${fullImage}

High or critical vulnerabilities detected.
Pipeline execution stopped.
"""
            }
        }
    }
}

return this
