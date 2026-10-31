@echo off
title SwiftShare Server - High-Concurrency File Distribution
cd /d "%~dp0"
cls
echo ======================================================================
echo    🚀 SWIFTSHARE FILE DISTRIBUTION SERVER
echo ======================================================================
echo.
echo Starting backend server on http://localhost:3000 ...
echo.
echo [!] IMPORTANT: KEEP THIS WINDOW OPEN while using SwiftShare!
echo     (Closing this window will shut down the server)
echo.
echo ======================================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/ to run SwiftShare.
    echo.
    pause
    exit /b 1
)

node server.js
if %ERRORLEVEL% neq 0 (
    echo.
    echo [!] Server stopped unexpectedly.
    pause
)
