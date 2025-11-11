# CI/CD Setup for NTDP Front Office Automation

This guide explains how to run the Playwright test suite in various CI/CD environments.

## 🚀 Quick Start Commands

### Local CI Simulation
```bash
# Install CI dependencies
npm run install:ci

# Run tests with CI reporters
npm run test:ci

# Run specific browser in CI mode
npm run test:ci:chromium
```

### Docker

**Prerequisites:**
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop/
# For Windows: Download and install Docker Desktop for Windows
# Verify installation
docker --version
docker compose version
```

**Method 1: Docker Compose (Recommended)**
```bash
# Build and run all tests
docker compose up --build

# Run tests with custom environment variables
BASE_URL=https://portal-uat.ntdp-sa.com SAUDI_ID=1111111111 docker compose up --build

# Run in detached mode
docker compose up --build -d

# View logs
docker compose logs -f

# Clean up
docker compose down
```

**Method 2: Direct Docker Run**
```bash
# Build the image
docker build -t ntdp-playwright-tests .

# Run all tests
docker run --rm -v ${PWD}/test-results:/app/test-results -v ${PWD}/playwright-report:/app/playwright-report ntdp-playwright-tests

# Run specific browser
docker run --rm -e BASE_URL=https://portal-uat.ntdp-sa.com ntdp-playwright-tests npx playwright test --project=chromium

# Run with custom environment variables
docker run --rm \
  -e BASE_URL=https://portal-uat.ntdp-sa.com \
  -e SAUDI_ID=1111111111 \
  -e EXPECTED_NAME=Dummy \
  -v ${PWD}/test-results:/app/test-results \
  -v ${PWD}/playwright-report:/app/playwright-report \
  ntdp-playwright-tests

# Interactive mode for debugging
docker run -it --rm ntdp-playwright-tests /bin/bash
```

**Method 3: One-liner for Quick Testing**
```bash
# Windows PowerShell
docker run --rm -v ${PWD}/test-results:/app/test-results mcr.microsoft.com/playwright:v1.40.0-focal sh -c "cd /app && npm install && npx playwright test"

# Linux/Mac
docker run --rm -v $(pwd)/test-results:/app/test-results mcr.microsoft.com/playwright:v1.40.0-focal sh -c "cd /app && npm install && npx playwright test"
```

## 🔧 CI/CD Platforms

### GitHub Actions

**Setup:**
1. Copy `.github/workflows/playwright.yml` to your repository
2. Set up repository secrets:
   - `BASE_URL` (optional, defaults to UAT)
   - `SAUDI_ID` (optional, defaults to 1111111111)
   - `EXPECTED_NAME` (optional, defaults to Dummy)

**Features:**
- ✅ Multi-browser testing (Chrome, Firefox, WebKit)
- ✅ Parallel execution
- ✅ Artifact upload (reports & screenshots)
- ✅ Test result publishing
- ✅ Automatic report merging

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

### Azure DevOps

**Setup:**
1. Copy `azure-pipelines.yml` to your repository
2. Create variable group `NTDP-Test-Variables` with:
   - `BASE_URL`
   - `SAUDI_ID`
   - `EXPECTED_NAME`

**Features:**
- ✅ Multi-browser matrix execution
- ✅ Test result publishing
- ✅ Build artifact storage
- ✅ JUnit XML reports

### Jenkins

**Pipeline Script:**
```groovy
pipeline {
    agent any
    
    environment {
        BASE_URL = "${env.BASE_URL ?: 'https://portal-uat.ntdp-sa.com'}"
        SAUDI_ID = "${env.SAUDI_ID ?: '1111111111'}"
        EXPECTED_NAME = "${env.EXPECTED_NAME ?: 'Dummy'}"
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Chromium') {
                    steps {
                        sh 'npm run test:ci:chromium'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'npm run test:ci:firefox'
                    }
                }
                stage('WebKit') {
                    steps {
                        sh 'npm run test:ci:webkit'
                    }
                }
            }
        }
    }
    
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
        }
    }
}
```

### GitLab CI

**`.gitlab-ci.yml`:**
```yaml
stages:
  - test

variables:
  BASE_URL: "https://portal-uat.ntdp-sa.com"
  SAUDI_ID: "1111111111"
  EXPECTED_NAME: "Dummy"

playwright-tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  
  before_script:
    - npm ci
    - npx playwright install --with-deps
  
  script:
    - npm run test:ci
  
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: test-results/results.xml
    expire_in: 30 days
  
  parallel:
    matrix:
      - BROWSER: [chromium, firefox, webkit]
  
  script:
    - npx playwright test --project=$BROWSER --reporter=junit,html
```

## 🔐 Environment Variables

Required environment variables for CI:

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Portal URL | `https://portal-uat.ntdp-sa.com` |
| `SAUDI_ID` | Test Saudi ID | `1111111111` |
| `EXPECTED_NAME` | Expected user name | `Dummy` |

## 📊 Reports & Artifacts

**Generated Artifacts:**
- `playwright-report/` - HTML test reports
- `test-results/` - Screenshots, videos, traces
- `results.xml` - JUnit XML for CI integration

**Report Access:**
- **GitHub Actions**: Check Actions tab → Artifacts
- **Azure DevOps**: Pipeline → Artifacts tab
- **Jenkins**: Build → Playwright Report
- **Local**: `npm run test:report`

## 🐛 Debugging CI Issues

**Common Issues:**

1. **Browser Installation:**
   ```bash
   npx playwright install --with-deps
   ```

2. **Permission Issues:**
   ```bash
   # Linux/Ubuntu
   sudo apt-get update
   sudo apt-get install -y xvfb
   ```

3. **Environment Variables:**
   ```bash
   # Verify .env creation
   cat .env
   
   # Check environment in CI
   env | grep -E "(BASE_URL|SAUDI_ID|EXPECTED_NAME)"
   ```

4. **Test Timeouts:**
   - Increase timeout in `playwright.config.ts`
   - Add retries for flaky tests
   - Use `--max-failures=1` to fail fast

## 🚀 Advanced CI Features

**Parallel Execution:**
```yaml
# GitHub Actions matrix
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    shard: [1/3, 2/3, 3/3]
```

**Test Sharding:**
```bash
npx playwright test --shard=1/3
npx playwright test --shard=2/3  
npx playwright test --shard=3/3
```

**Conditional Execution:**
```yaml
# Only run on specific file changes
paths:
  include:
    - 'tests/**'
    - 'pages/**'
    - 'playwright.config.ts'
```

## 📈 Performance Optimization

**CI Performance Tips:**
- Use `npm ci` instead of `npm install`
- Cache `node_modules` and Playwright browsers
- Run tests in parallel where possible
- Use Docker images with pre-installed browsers
- Implement smart test selection based on file changes

**Example Cache Configuration (GitHub Actions):**
```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```