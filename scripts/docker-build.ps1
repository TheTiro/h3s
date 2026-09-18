# Builds h3studios Docker image with NEXT_PUBLIC_* from .env.local.
# Usage: .\scripts\docker-build.ps1
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Get-DotEnvValue([string]$Name) {
  $line = Get-Content .\.env.local -ErrorAction Stop |
    Where-Object { $_ -match ("^\s*" + [regex]::Escape($Name) + "\s*=") } |
    Select-Object -First 1
  if (-not $line) { return "" }
  return ($line -split "=", 2)[1].Trim().Trim("'").Trim('"')
}

$siteKey = Get-DotEnvValue "NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
$secretKey = Get-DotEnvValue "RECAPTCHA_SECRET_KEY"
# Production site URL for Docker deploy (not localhost from .env.local)
$siteUrl = "https://h3studios.ba"

if (-not $siteKey) {
  throw "Nedostaje NEXT_PUBLIC_RECAPTCHA_SITE_KEY u .env.local"
}
if (-not $secretKey) {
  Write-Warning "RECAPTCHA_SECRET_KEY nije u .env.local - cPanel runtime treba secret."
}

Write-Host "NEXT_PUBLIC_SITE_URL=$siteUrl"
$previewLen = [Math]::Min(12, $siteKey.Length)
Write-Host "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$($siteKey.Substring(0, $previewLen))..."

docker build `
  --build-arg "NEXT_PUBLIC_SITE_URL=$siteUrl" `
  --build-arg "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$siteKey" `
  -t h3studios-build .

Write-Host ""
Write-Host "cPanel -> Setup Node.js App -> Environment variables:" -ForegroundColor Yellow
Write-Host "  RECAPTCHA_SECRET_KEY=(from .env.local - do not print)"
Write-Host "  CONTACT_RECIPIENT_EMAIL, MAIL_*"
Write-Host "  (Restart app nakon snimanja env-a)"
Write-Host ""
Write-Host "Zatim izvuci artefakte (docker_commands.md korak 2)." -ForegroundColor Cyan
