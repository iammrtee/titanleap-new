@echo off
cd /d "%~dp0"
echo Deploying TitanLeap...

:: Clear stale git lock files
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock"  del /f ".git\HEAD.lock"

git add .
git commit -m "Update site"
git pull --reba