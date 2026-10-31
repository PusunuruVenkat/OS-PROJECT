@echo off
title Stop SwiftShare Server
cd /d "%~dp0"
echo ======================================================================
echo    🛑 STOPPING SWIFTSHARE SERVER
echo ======================================================================
echo.
echo Stopping any running SwiftShare / Node instances on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Terminating PID %%a...
    taskkill /F /PID %%a 2>nul
)
echo.
echo [OK] Port 3000 is now free.
echo.
pause
