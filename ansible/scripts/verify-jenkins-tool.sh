#!/bin/bash
# =========================================================
# Script: verify-jenkins-tool.sh
# Purpose:
#   - Verify all required CI / GitOps / DevSecOps tools
#   - Ensure tools are accessible to Jenkins user
# =========================================================

set -e

JENKINS_USER="jenkins"

echo "============================================="
echo " Verifying Jenkins CI Toolchain"
echo " Running checks as user: ${JENKINS_USER}"
echo "============================================="

TOOLS=(
  "docker ps"
  "git --version"
  "dotnet --version"
  "node --version"
  "npm --version"
  "kustomize version"
  "trivy version"
)

for tool in "${TOOLS[@]}"; do
  echo ""
  echo "➡️  Checking: $tool"
  sudo -u "${JENKINS_USER}" $tool
done

echo ""
echo "✅ All Jenkins tools are installed globally and accessible"
echo "✅ Jenkins VM is CI / GitOps / DevSecOps READY"
