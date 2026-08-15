@echo off
echo ========================================================
echo Fixing permissions and copying files to C:\Users\Projects\Storm ...
echo ========================================================

icacls "C:\Users\Projects\Storm" /grant Users:(OI)(CI)F /T /C /Q
icacls "C:\Users\Projects\Storm\*" /grant Users:(OI)(CI)F /T /C /Q

xcopy "C:\Users\Projects\lumina\Storm\*" "C:\Users\Projects\Storm\" /E /I /H /Y /Q

if exist "C:\Users\Projects\Storm\node_modules\.vite-temp" rmdir /s /q "C:\Users\Projects\Storm\node_modules\.vite-temp"
icacls "C:\Users\Projects\Storm\node_modules" /grant Users:(OI)(CI)F /T /C /Q

echo.
echo ========================================================
echo SUCCESS! All permissions fixed and project files copied.
echo You can now run 'npm run dev' in VS Code!
echo ========================================================
pause
