# Red Hat OpenShift Deployment Script for MemoryMate (PowerShell)
param(
    [string]$ProjectName = "memorymate"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Deploying MemoryMate to Red Hat OpenShift ($ProjectName)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verify oc CLI is installed and logged in
try {
    $whoami = oc whoami 2>$null
    if (-not $whoami) {
        Write-Error "Error: 'oc' CLI is not logged in. Run 'oc login' to your OpenShift cluster first."
        exit 1
    }
    Write-Host "Logged in to OpenShift as: $whoami" -ForegroundColor Green
} catch {
    Write-Error "Error: 'oc' command not found. Please install the OpenShift CLI (oc)."
    exit 1
}

# 2. Create or switch to project
Write-Host "`n[Step 1/5] Switching to project '$ProjectName'..." -ForegroundColor Yellow
oc new-project $ProjectName 2>$null
oc project $ProjectName

# 3. Deploy MongoDB
Write-Host "`n[Step 2/5] Deploying MongoDB Database..." -ForegroundColor Yellow
oc apply -f openshift/01-mongodb.yaml

# 4. Create Binary BuildConfigs for Backend and Frontend
Write-Host "`n[Step 3/5] Setting up OpenShift BuildConfigs..." -ForegroundColor Yellow
oc new-build --name=backend --binary --strategy=docker -l app=memorymate 2>$null
oc new-build --name=frontend --binary --strategy=docker -l app=memorymate 2>$null

# 5. Build Container Images on OpenShift
Write-Host "`n[Step 4/5] Building Backend Container in OpenShift Cluster..." -ForegroundColor Yellow
oc start-build backend --from-dir=./backend --follow

Write-Host "`n[Step 4.5/5] Building Frontend Container in OpenShift Cluster..." -ForegroundColor Yellow
oc start-build frontend --from-dir=./frontend --follow

# 6. Apply Deployments, Services & Routes
Write-Host "`n[Step 5/5] Deploying Services, Deployments and HTTPS Routes..." -ForegroundColor Yellow
oc apply -f openshift/02-backend.yaml
oc apply -f openshift/03-frontend.yaml

# 7. Print Routes
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$frontendRoute = oc get route memorymate -o jsonpath='{.spec.host}' 2>$null
$backendRoute = oc get route memorymate-api -o jsonpath='{.spec.host}' 2>$null

Write-Host "Frontend Public URL: https://$frontendRoute" -ForegroundColor Cyan
Write-Host "Backend API URL:     https://$backendRoute" -ForegroundColor Cyan
