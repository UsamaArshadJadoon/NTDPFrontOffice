# OWASP ZAP Quick Start Script
# This script helps you quickly start ZAP for security testing

Write-Host "🔒 OWASP ZAP Quick Start for Security Testing" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if ZAP is installed
$zapPath = Get-Command zap.bat -ErrorAction SilentlyContinue

if (-not $zapPath) {
    Write-Host "❌ OWASP ZAP not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installation Options:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://www.zaproxy.org/download/" -ForegroundColor White
    Write-Host "   2. Using Chocolatey: choco install zap" -ForegroundColor White
    Write-Host "   3. Using Docker: docker run -d -p 8080:8080 owasp/zap2docker-stable zap.sh -daemon" -ForegroundColor White
    Write-Host ""
    
    # Ask if user wants to use Docker
    $useDocker = Read-Host "Would you like to start ZAP using Docker? (y/n)"
    
    if ($useDocker -eq 'y' -or $useDocker -eq 'Y') {
        Write-Host ""
        Write-Host "🐳 Starting OWASP ZAP in Docker..." -ForegroundColor Cyan
        
        # Check if Docker is running
        try {
            docker ps | Out-Null
            
            # Stop existing ZAP container if running
            $existingContainer = docker ps -q --filter "ancestor=owasp/zap2docker-stable"
            if ($existingContainer) {
                Write-Host "🛑 Stopping existing ZAP container..." -ForegroundColor Yellow
                docker stop $existingContainer | Out-Null
                docker rm $existingContainer | Out-Null
            }
            
            # Start new ZAP container
            Write-Host "🚀 Starting ZAP container..." -ForegroundColor Green
            docker run -d -p 8080:8080 `
                -e ZAP_API_KEY=changeme `
                --name zap-proxy `
                owasp/zap2docker-stable `
                zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.key=changeme
            
            Write-Host ""
            Write-Host "⏳ Waiting for ZAP to start (30 seconds)..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
            
            Write-Host ""
            Write-Host "✅ ZAP is running in Docker!" -ForegroundColor Green
            Write-Host "   Container: zap-proxy" -ForegroundColor White
            Write-Host "   URL: http://localhost:8080" -ForegroundColor White
            Write-Host "   API Key: changeme" -ForegroundColor White
            Write-Host ""
            Write-Host "To stop ZAP later, run: docker stop zap-proxy && docker rm zap-proxy" -ForegroundColor Cyan
            
        }
        catch {
            Write-Host ""
            Write-Host "❌ Docker not found or not running" -ForegroundColor Red
            Write-Host "   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor White
            exit 1
        }
    }
    else {
        Write-Host ""
        Write-Host "Please install OWASP ZAP manually and run this script again." -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "✅ OWASP ZAP found: $($zapPath.Source)" -ForegroundColor Green
    Write-Host ""
    
    # Check if ZAP is already running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ ZAP is already running on http://localhost:8080" -ForegroundColor Green
    }
    catch {
        Write-Host "🚀 Starting OWASP ZAP in daemon mode..." -ForegroundColor Cyan
        Write-Host ""
        
        # Start ZAP in daemon mode
        $zapProcess = Start-Process -FilePath "zap.bat" -ArgumentList "-daemon", "-port", "8080", "-config", "api.key=changeme" -PassThru -WindowStyle Hidden
        
        Write-Host "⏳ Waiting for ZAP to start (30 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        Write-Host ""
        Write-Host "✅ ZAP started successfully!" -ForegroundColor Green
        Write-Host "   Process ID: $($zapProcess.Id)" -ForegroundColor White
        Write-Host "   URL: http://localhost:8080" -ForegroundColor White
        Write-Host "   API Key: changeme" -ForegroundColor White
        Write-Host ""
        Write-Host "To stop ZAP later, run: Stop-Process -Id $($zapProcess.Id)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🧪 Ready to run ZAP security tests!" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "   npm run test:zap           - Run all ZAP tests" -ForegroundColor White
Write-Host "   npm run test:zap:passive   - Quick passive scan (~10s)" -ForegroundColor White
Write-Host "   npm run test:zap:spider    - Spider scan (~1-2min)" -ForegroundColor White
Write-Host "   npm run test:zap:active    - Active scan (~5-10min)" -ForegroundColor White
Write-Host "   npm run test:zap:full      - Full authenticated scan" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more information, see: docs/ZAP-INTEGRATION.md" -ForegroundColor Cyan
Write-Host ""
