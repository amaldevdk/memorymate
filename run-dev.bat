@echo off
title MemoryMate - Alzheimer's Memory Assistant Platform
echo ==========================================================
echo  Starting MemoryMate - Alzheimer's Memory Assistant Platform
echo ==========================================================
echo.
echo Starting Backend API on port 5000...
start cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 2 /nobreak >nul
echo Starting Frontend on port 5173...
start cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo MemoryMate launched!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
pause
