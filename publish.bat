@echo off

echo.
echo ==========================
echo   Building gallery...
echo ==========================
echo.

node build.js

if errorlevel 1 (
    echo.
    echo BUILD FAILED - nothing was pushed.
    pause
    exit /b 1
)

echo.
echo ==========================
echo   Adding changes...
echo ==========================
echo.

git add -A

git diff --cached --quiet

if %errorlevel%==0 (
    echo.
    echo Nothing changed. Nothing to commit.
    pause
    exit /b 0
)

echo.
echo ==========================
echo   Committing...
echo ==========================
echo.

git commit -m "Update gallery"

if errorlevel 1 (
    echo.
    echo COMMIT FAILED - nothing was pushed.
    pause
    exit /b 1
)

echo.
echo ==========================
echo   Pushing...
echo ==========================
echo.

git push

if errorlevel 1 (
    echo.
    echo PUSH FAILED.
    pause
    exit /b 1
)

echo.
echo ==========================
echo   Done!
echo ==========================
echo.

pause