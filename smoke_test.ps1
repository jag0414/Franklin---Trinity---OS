Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$BaseUrl = if ($env:FRANKLIN_API_BASE_URL) { $env:FRANKLIN_API_BASE_URL } else { "http://127.0.0.1:8000" }

function Invoke-JsonPost {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][object]$Body
  )

  $json = $Body | ConvertTo-Json -Depth 20
  return Invoke-RestMethod -Method Post -Uri $Url -ContentType "application/json" -Body $json
}

function Invoke-JsonGet {
  param(
    [Parameter(Mandatory = $true)][string]$Url
  )

  return Invoke-RestMethod -Method Get -Uri $Url
}

function Wait-Task {
  param(
    [Parameter(Mandatory = $true)][string]$TaskId,
    [int]$TimeoutSeconds = 180
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    $task = Invoke-JsonGet -Url "$BaseUrl/api/orchestrator/tasks/$TaskId"

    if ($task.status -eq "completed") { return $task }
    if ($task.status -eq "failed") {
      $err = $task.error
      if (-not $err) { $err = "Task failed (no error message)" }

      if ($err -match "Missing GOOGLE_API_KEY") {
        $err = $err + "`nTip: Start_Backend.ps1 must be run in the same terminal where you set `$env:GOOGLE_API_KEY."
      }

      throw $err
    }

    Start-Sleep -Milliseconds 250
  }

  throw "Timed out waiting for task $TaskId"
}

Write-Host "BaseUrl: $BaseUrl"

Write-Host "1) Health..."
$maxRetries = 20
$retryCount = 0
$health = $null

while ($retryCount -lt $maxRetries) {
    try {
        $health = Invoke-JsonGet -Url "$BaseUrl/health"
        if ($health.status -eq "ok") {
            break
        }
    }
    catch {
        Write-Host "   Waiting for backend... ($($retryCount + 1)/$maxRetries)" -ForegroundColor DarkGray
    }
    Start-Sleep -Seconds 1
    $retryCount++
}

if (-not $health -or $health.status -ne "ok") { 
    throw "Health check failed after $maxRetries attempts." 
}
Write-Host "   OK"

Write-Host "2) List pipelines..."
$pipes = Invoke-JsonGet -Url "$BaseUrl/api/ai/pipelines"
if (-not $pipes) { throw "No pipelines returned" }
Write-Host ("   OK ({0} pipelines)" -f $pipes.Count)

Write-Host "3) Execute pipeline (code-gen) async..."
$pipelineStart = Invoke-JsonPost -Url "$BaseUrl/api/ai/pipelines/execute" -Body @{
  pipelineId = "code-gen"
  input      = "Generate a small example Python function and documentation."
  context    = @()
}

if (-not $pipelineStart.taskId) { throw "Pipeline did not return taskId: $($pipelineStart | ConvertTo-Json -Depth 10)" }

$null = Wait-Task -TaskId $pipelineStart.taskId -TimeoutSeconds 240
Write-Host "   OK (pipeline completed)"

Write-Host "4) Execute multi-agent async..."
$maStart = Invoke-JsonPost -Url "$BaseUrl/api/ai/multi-agent" -Body @{
  prompt      = "Give pros/cons of bounded concurrency for multi-agent orchestration."
  agents      = @("openai", "anthropic")
  requestType = "text"
}

if (-not $maStart.taskId) { throw "Multi-agent did not return taskId: $($maStart | ConvertTo-Json -Depth 10)" }

$null = Wait-Task -TaskId $maStart.taskId -TimeoutSeconds 240
Write-Host "   OK (multi-agent completed)"

Write-Host "Smoke test PASSED."