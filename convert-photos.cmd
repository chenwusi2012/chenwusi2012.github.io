@echo off
setlocal

set "BUNDLED_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if exist "%BUNDLED_PYTHON%" (
  "%BUNDLED_PYTHON%" "%~dp0scripts\convert_photos.py" %*
  exit /b %ERRORLEVEL%
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
  python "%~dp0scripts\convert_photos.py" %*
  exit /b %ERRORLEVEL%
)

where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
  py "%~dp0scripts\convert_photos.py" %*
  exit /b %ERRORLEVEL%
)

echo Python was not found. Open this project in Codex and ask it to convert the new photos.
exit /b 1

