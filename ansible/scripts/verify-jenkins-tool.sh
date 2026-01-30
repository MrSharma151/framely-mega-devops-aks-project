#!/bin/bash
# =========================================================
# Script: verify-jenkins-tool.sh
# Purpose:
#   - Verify all required CI / GitOps / DevSecOps tools
#   - Ensure tools are accessible to Jenkins user
# =========================================================

set -e

JENKINS_USER="jenkins"
SAFE_DIR="/tmp"

echo "============================================="
echo " Verifying Jenkins CI Toolchain"
echo " Running checks as user: ${JENKINS_USER}"
echo "============================================="

run_check() {
  local cmd="$1"
  echo ""
  echo "➡️  Checking: $cmd"
  sudo -u "${JENKINS_USER}" bash -c "cd ${SAFE_DIR} && $cmd"
}

run_check "docker ps"
run_check "git --version"
run_check "dotnet --version"
run_check "node --version"
run_check "npm --version"
run_check "kustomize version"
run_check "trivy version"

echo ""
echo "✅ All Jenkins tools are installed globally and accessible"
echo "✅ Jenkins VM is CI / GitOps / DevSecOps READY"
