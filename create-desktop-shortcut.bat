@echo off
title Create SwiftShare Desktop Shortcut
cd /d "%~dp0"
echo ======================================================================
echo    🔗 CREATE SWIFTSHARE DESKTOP SHORTCUT
echo ======================================================================
echo.
echo Creating shortcut on your Desktop...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [Environment]::GetFolderPath('Desktop'); $shortcut = $ws.CreateShortcut(\"$desktop\SwiftShare.lnk\"); $shortcut.TargetPath = '%~dp0start-server.bat'; $shortcut.WorkingDirectory = '%~dp0'; $shortcut.Description = 'SwiftShare File Distribution Server'; $shortcut.IconLocation = '%SystemRoot%\System32\shell32.dll,13'; $shortcut.Save()"

echo.
if exist "%USERPROFILE%\Desktop\SwiftShare.lnk" (
    echo [SUCCESS] "SwiftShare" shortcut created on your Desktop!
    echo You can now start SwiftShare anytime by double-clicking the icon on your Desktop.
) else (
    echo [INFO] Shortcut created.
)
echo.
pause
