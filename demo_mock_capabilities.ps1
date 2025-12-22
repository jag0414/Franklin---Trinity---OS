$ErrorActionPreference = "Stop"
$BaseUrl = "http://127.0.0.1:8000"

function Invoke-AI {
    param($Provider, $Prompt, $Type="text")
    Write-Host "Requesting $Provider ($Type)..." -NoNewline
    try {
        $body = @{
            provider = $Provider
            prompt = $Prompt
            type = $Type
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/ai/execute" -ContentType "application/json" -Body $body
        Write-Host " Done." -ForegroundColor Green
        Write-Host "Response: $($response.content)" -ForegroundColor Cyan
        Write-Host ""
    }
    catch {
        Write-Host " Failed: $_" -ForegroundColor Red
    }
}

Write-Host "--- FRANKLIN OS MOCK CAPABILITIES DEMO ---" -ForegroundColor Yellow
Write-Host ""

# 1. Test OpenAI Mock
Invoke-AI -Provider "openai" -Prompt "Hello, are you online?"

# 2. Test Anthropic Mock
Invoke-AI -Provider "anthropic" -Prompt "Analyze this system architecture."

# 3. Test Google Mock
Invoke-AI -Provider "google" -Prompt "List the planets."

# 4. Test Stability Mock (Image)
Invoke-AI -Provider "stability" -Prompt "A futuristic city" -Type "image"

Write-Host "--- DEMO COMPLETE ---" -ForegroundColor Yellow
