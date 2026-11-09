#!/usr/bin/env bash
set -e

PROJECT_NAME=${1:-"memorymate"}

echo "=========================================================="
echo " Deploying MemoryMate to Red Hat OpenShift ($PROJECT_NAME)"
echo "=========================================================="

# Check oc login
if ! oc whoami &>/dev/null; then
  echo "Error: 'oc' CLI is not logged in. Run 'oc login' first."
  exit 1
fi

echo "Logged in as $(oc whoami)"

# Switch / Create Project
oc new-project "$PROJECT_NAME" 2>/dev/null || true
oc project "$PROJECT_NAME"

# Deploy MongoDB
echo "Deploying MongoDB..."
oc apply -f openshift/01-mongodb.yaml

# Create Builds
echo "Creating OpenShift Binary BuildConfigs..."
oc new-build --name=backend --binary --strategy=docker -l app=memorymate 2>/dev/null || true
oc new-build --name=frontend --binary --strategy=docker -l app=memorymate 2>/dev/null || true

# Trigger Builds
echo "Building Backend Container..."
oc start-build backend --from-dir=./backend --follow

echo "Building Frontend Container..."
oc start-build frontend --from-dir=./frontend --follow

# Deploy Deployments and Routes
echo "Applying Deployments and HTTPS Routes..."
oc apply -f openshift/02-backend.yaml
oc apply -f openshift/03-frontend.yaml

# Show URLs
echo "=========================================================="
echo " Deployment Complete!"
echo "=========================================================="
echo "Frontend URL: https://$(oc get route memorymate -o jsonpath='{.spec.host}')"
echo "Backend URL:  https://$(oc get route memorymate-api -o jsonpath='{.spec.host}')"
