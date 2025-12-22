Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot
try {
  if (!(Test-Path ".\\.venv\\Scripts\\python.exe")) {
    py -m venv .venv
  }

  .\.venv\Scripts\Activate.ps1 | Out-Null

  if (Test-Path "requirements.txt") {
    py -m pip install -U pip
    py -m pip install -r requirements.txt
  }

  # Quick env validation (pipelines/multi-agent will fail without these)
  $missing = @()
  if (-not $env:OPENAI_API_KEY) { $missing += "OPENAI_API_KEY" }
  if (-not $env:ANTHROPIC_API_KEY) { $missing += "ANTHROPIC_API_KEY" }
  if (-not $env:GOOGLE_API_KEY) { $missing += "GOOGLE_API_KEY" }
  if (-not $env:STABILITY_API_KEY) { $missing += "STABILITY_API_KEY" }

  if ($missing.Count -gt 0) {
    Write-Host "Missing required environment variables:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "Set them in THIS terminal before starting the backend, for example:" -ForegroundColor Yellow
    Write-Host "  `$env:OPENAI_API_KEY=\"...\"" -ForegroundColor Yellow
    Write-Host "  `$env:ANTHROPIC_API_KEY=\"...\"" -ForegroundColor Yellow
    Write-Host "  `$env:GOOGLE_API_KEY=\"...\"" -ForegroundColor Yellow
    Write-Host "  `$env:STABILITY_API_KEY=\"...\"" -ForegroundColor Yellow
    Write-Host "Proceeding in MOCK MODE..." -ForegroundColor Magenta
  }

  py -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
}
finally {
  Pop-Location
}
