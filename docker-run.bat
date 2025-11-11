@echo off
REM Docker setup and run script for NTDP Playwright Tests (Windows)

echo 🐳 NTDP Playwright Docker Runner
echo ================================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed!
    echo 📥 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    echo 🔄 After installation, restart your terminal and run this script again.
    exit /b 1
)

echo ✅ Docker is installed
docker --version

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running!
    echo 🚀 Please start Docker Desktop and try again.
    exit /b 1
)

echo ✅ Docker is running

REM Set default environment variables if not provided
if not defined BASE_URL set BASE_URL=https://portal-uat.ntdp-sa.com
if not defined SAUDI_ID set SAUDI_ID=1111111111
if not defined EXPECTED_NAME set EXPECTED_NAME=Dummy

REM Parse command line arguments
set COMMAND=%1
if "%COMMAND%"=="" set COMMAND=all

if "%COMMAND%"=="all" goto :run_all_tests
if "%COMMAND%"=="chromium" goto :run_browser_test
if "%COMMAND%"=="firefox" goto :run_browser_test
if "%COMMAND%"=="webkit" goto :run_browser_test
if "%COMMAND%"=="compose" goto :run_compose
if "%COMMAND%"=="shell" goto :run_shell
if "%COMMAND%"=="clean" goto :clean_docker
if "%COMMAND%"=="help" goto :show_usage
goto :show_usage

:run_all_tests
echo 🔨 Building Docker image...
docker build -t ntdp-playwright-tests .
if errorlevel 1 (
    echo ❌ Failed to build Docker image
    exit /b 1
)

echo ✅ Image built successfully
echo 🧪 Running Playwright tests...

REM Create directories for results
if not exist test-results mkdir test-results
if not exist playwright-report mkdir playwright-report

REM Run tests with volume mounts
docker run --rm ^
    -e BASE_URL=%BASE_URL% ^
    -e SAUDI_ID=%SAUDI_ID% ^
    -e EXPECTED_NAME=%EXPECTED_NAME% ^
    -v "%CD%/test-results:/app/test-results" ^
    -v "%CD%/playwright-report:/app/playwright-report" ^
    ntdp-playwright-tests

if errorlevel 1 (
    echo ❌ Tests failed. Check the output above for details.
    exit /b 1
) else (
    echo ✅ Tests completed successfully!
    echo 📊 Reports available in:
    echo    - playwright-report/index.html
    echo    - test-results/ (screenshots, videos)
)
goto :end

:run_browser_test
echo 🔨 Building Docker image...
docker build -t ntdp-playwright-tests .
if errorlevel 1 exit /b 1

echo 🧪 Running tests for %COMMAND% browser...
docker run --rm ^
    -e BASE_URL=%BASE_URL% ^
    -e SAUDI_ID=%SAUDI_ID% ^
    -e EXPECTED_NAME=%EXPECTED_NAME% ^
    -v "%CD%/test-results:/app/test-results" ^
    -v "%CD%/playwright-report:/app/playwright-report" ^
    ntdp-playwright-tests npx playwright test --project=%COMMAND%
goto :end

:run_compose
echo 🐳 Using Docker Compose...
docker compose up --build 2>nul
if errorlevel 1 (
    docker-compose up --build 2>nul
    if errorlevel 1 (
        echo ❌ Docker Compose not available
        exit /b 1
    )
)
goto :end

:run_shell
echo 🔨 Building Docker image...
docker build -t ntdp-playwright-tests .
if errorlevel 1 exit /b 1

echo 🐚 Opening interactive shell...
docker run -it --rm ntdp-playwright-tests /bin/bash
goto :end

:clean_docker
echo 🧹 Cleaning up Docker resources...
docker rmi ntdp-playwright-tests 2>nul
docker system prune -f
echo ✅ Cleanup completed
goto :end

:show_usage
echo Usage: %0 [option]
echo.
echo Options:
echo   all          Run all browsers (default)
echo   chromium     Run Chromium tests only
echo   firefox      Run Firefox tests only
echo   webkit       Run WebKit tests only
echo   compose      Use docker-compose instead
echo   shell        Open interactive shell in container
echo   clean        Remove Docker images and containers
echo.
echo Environment Variables:
echo   BASE_URL     Portal URL (default: https://portal-uat.ntdp-sa.com)
echo   SAUDI_ID     Test Saudi ID (default: 1111111111)
echo   EXPECTED_NAME Expected user name (default: Dummy)
echo.
echo Examples:
echo   %0                    # Run all tests
echo   %0 chromium          # Run Chromium only
echo   set BASE_URL=https://custom-url.com ^& %0  # Custom URL
goto :end

:end