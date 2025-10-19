# Start Frontend Server
Write-Host "🎨 Starting Sales Automation Frontend..." -ForegroundColor Cyan

# Navigate to frontend
Set-Location frontend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host ""
Write-Host "✨ Starting frontend server on http://localhost:5173" -ForegroundColor Green
Write-Host ""
npm run dev
