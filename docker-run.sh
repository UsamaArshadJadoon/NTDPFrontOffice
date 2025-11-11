#!/bin/bash
# Docker setup and run script for NTDP Playwright Tests

echo "🐳 NTDP Playwright Docker Runner"
echo "================================"

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed!"
        echo "📥 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/"
        echo "🔄 After installation, restart your terminal and run this script again."
        exit 1
    fi
    echo "✅ Docker is installed: $(docker --version)"
}

# Function to check if Docker is running
check_docker_running() {
    if ! docker info &> /dev/null; then
        echo "❌ Docker is not running!"
        echo "🚀 Please start Docker Desktop and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build and run tests
run_tests() {
    echo "🔨 Building Docker image..."
    docker build -t ntdp-playwright-tests .
    
    if [ $? -eq 0 ]; then
        echo "✅ Image built successfully"
        echo "🧪 Running Playwright tests..."
        
        # Create directories for results
        mkdir -p test-results playwright-report
        
        # Run tests with volume mounts for results
        docker run --rm \
            -e BASE_URL=${BASE_URL:-https://portal-uat.ntdp-sa.com} \
            -e SAUDI_ID=${SAUDI_ID:-1111111111} \
            -e EXPECTED_NAME=${EXPECTED_NAME:-Dummy} \
            -v "$(pwd)/test-results:/app/test-results" \
            -v "$(pwd)/playwright-report:/app/playwright-report" \
            ntdp-playwright-tests
        
        if [ $? -eq 0 ]; then
            echo "✅ Tests completed successfully!"
            echo "📊 Reports available in:"
            echo "   - playwright-report/index.html"
            echo "   - test-results/ (screenshots, videos)"
        else
            echo "❌ Tests failed. Check the output above for details."
            exit 1
        fi
    else
        echo "❌ Failed to build Docker image"
        exit 1
    fi
}

# Function to run specific browser
run_browser_test() {
    local browser=$1
    echo "🧪 Running tests for $browser browser..."
    
    docker run --rm \
        -e BASE_URL=${BASE_URL:-https://portal-uat.ntdp-sa.com} \
        -e SAUDI_ID=${SAUDI_ID:-1111111111} \
        -e EXPECTED_NAME=${EXPECTED_NAME:-Dummy} \
        -v "$(pwd)/test-results:/app/test-results" \
        -v "$(pwd)/playwright-report:/app/playwright-report" \
        ntdp-playwright-tests npx playwright test --project=$browser
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  all          Run all browsers (default)"
    echo "  chromium     Run Chromium tests only"
    echo "  firefox      Run Firefox tests only"
    echo "  webkit       Run WebKit tests only"
    echo "  compose      Use docker-compose instead"
    echo "  shell        Open interactive shell in container"
    echo "  clean        Remove Docker images and containers"
    echo ""
    echo "Environment Variables:"
    echo "  BASE_URL     Portal URL (default: https://portal-uat.ntdp-sa.com)"
    echo "  SAUDI_ID     Test Saudi ID (default: 1111111111)"
    echo "  EXPECTED_NAME Expected user name (default: Dummy)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all tests"
    echo "  $0 chromium          # Run Chromium only"
    echo "  BASE_URL=https://custom-url.com $0  # Custom URL"
}

# Main script logic
main() {
    check_docker
    check_docker_running
    
    case "${1:-all}" in
        "all")
            run_tests
            ;;
        "chromium"|"firefox"|"webkit")
            echo "🔨 Building Docker image..."
            docker build -t ntdp-playwright-tests .
            run_browser_test $1
            ;;
        "compose")
            echo "🐳 Using Docker Compose..."
            if command -v docker-compose &> /dev/null; then
                docker-compose up --build
            else
                docker compose up --build
            fi
            ;;
        "shell")
            echo "🔨 Building Docker image..."
            docker build -t ntdp-playwright-tests .
            echo "🐚 Opening interactive shell..."
            docker run -it --rm ntdp-playwright-tests /bin/bash
            ;;
        "clean")
            echo "🧹 Cleaning up Docker resources..."
            docker rmi ntdp-playwright-tests 2>/dev/null || true
            docker system prune -f
            echo "✅ Cleanup completed"
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            echo "❌ Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"