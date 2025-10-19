# Start Backend Server
Write-Host "🚀 Starting Sales Automation Backend..." -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  .env file not found! Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Created .env file. Please edit it with your credentials!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Opening .env file for editing..." -ForegroundColor Yellow
    Start-Process notepad "backend\.env"
    Write-Host ""
    Write-Host "Press any key after editing .env to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Navigate to backend
Set-Location backend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host ""
Write-Host "✨ Starting backend server on http://localhost:5000" -ForegroundColor Green
Write-Host ""
npm run dev
