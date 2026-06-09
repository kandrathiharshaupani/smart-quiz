<#
run-all.ps1
Automates installing dependencies, optional SMTP env setup, starting the server,
and optionally launching ngrok. Run from e:\smartquiz in PowerShell.

Usage examples:
# Install, prompt for email setup, start server and ngrok
.\run-all.ps1 -SetupEmail -RunNgrok

# Just install and start server
.\run-all.ps1
#>

param(
  [switch]$SetupEmail,
  [switch]$RunNgrok
)

Write-Host "== SmartQuiz automation script =="

Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

if ($SetupEmail) {
  Write-Host "Configuring admin email / SMTP (interactive)..." -ForegroundColor Cyan
  $ADMIN_EMAIL = Read-Host "Admin email (recipient for notifications)"
  $SMTP_HOST = Read-Host "SMTP host (e.g. smtp.gmail.com)"
  $SMTP_PORT = Read-Host "SMTP port (e.g. 587)"
  $SMTP_USER = Read-Host "SMTP user (email)"
  $SMTP_PASS = Read-Host -AsSecureString "SMTP password or app password"
  $plainPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SMTP_PASS))

  # Set in current session (child processes will inherit)
  $env:ADMIN_EMAIL = $ADMIN_EMAIL
  $env:SMTP_HOST = $SMTP_HOST
  $env:SMTP_PORT = $SMTP_PORT
  $env:SMTP_USER = $SMTP_USER
  $env:SMTP_PASS = $plainPass

  # Persist (optional) using setx so future shells have them
  setx ADMIN_EMAIL $ADMIN_EMAIL | Out-Null
  setx SMTP_HOST $SMTP_HOST | Out-Null
  setx SMTP_PORT $SMTP_PORT | Out-Null
  setx SMTP_USER $SMTP_USER | Out-Null
  setx SMTP_PASS $plainPass | Out-Null

  Write-Host "SMTP environment variables set (persisted)." -ForegroundColor Green
}

Write-Host "Starting server in new terminal..." -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-Command","npm start"

if ($RunNgrok) {
  Write-Host "Attempting to start ngrok in new terminal..." -ForegroundColor Cyan
  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-Command","ngrok http 3000"
}

Write-Host "Done - server should be starting in a new window. Open http://localhost:3000" -ForegroundColor Green
