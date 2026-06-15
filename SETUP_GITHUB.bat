@echo off
cd /d "%~dp0"
echo Pushing TitanLeap to GitHub...

:: Remove broken .git folder if it exists
if exist ".git" (
  echo Removing old .git folder...
  rmdir /s /q ".git"
)

git init
git add .
git commit -m "Initial commit — TitanLeap website"
git branch -M main
git remote add origin https://github.com/iammrtee/titanleap-new.git
git push -u origin main

echo.
if %ERRORLEVEL% == 0 (
  echo Done! Code is live on GitHub.
) else (
  echo Something went wrong — check the error above.
)
pause
