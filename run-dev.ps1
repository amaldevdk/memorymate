# MemoryMate Start Script (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting MemoryMate - Alzheimer's Memory Assistant Platform" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

Write-Host "`n[1/2] Starting Node.js / Express Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; node server.js"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting React + Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

Write-Host "`nAll services launched!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
