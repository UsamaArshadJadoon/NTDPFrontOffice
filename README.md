# NTDP Front Office Automation - Clean & Fast

[![Playwright Tests](https://github.com/AzmDevelopment/NTDPFrontOffice/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/AzmDevelopment/NTDPFrontOffice/actions/workflows/playwright-ci.yml)
[![Deploy](https://github.com/AzmDevelopment/NTDPFrontOffice/actions/workflows/deploy.yml/badge.svg)](https://github.com/AzmDevelopment/NTDPFrontOffice/actions/workflows/deploy.yml)

## Overview

Ultra-fast Playwright automation for NTDP Portal with enhanced self-healing locators.

## Quick Start

```bash
# Run the fast test (34 seconds)
npx playwright test --config=playwright-fast-stable.config.ts

# Run with visible browser
npx playwright test --config=playwright-fast-stable.config.ts --headed
```

## Features

- ✅ **Ultra-fast execution** (34 seconds)
- ✅ **Self-healing locators** with AI-like learning
- ✅ **Happy path validation** with dashboard access
- ✅ **Production ready** automation

## Project Structure

```text
NTDPFrontOfficeAutomation/
├── tests/
│   └── login-dashboard-happy-path.spec.ts # Fast login to dashboard test
├── pages/
│   ├── LoginPage.ts                 # Enhanced login page
│   └── DashboardPage.ts             # Dashboard validation
├── utils/
│   ├── SelfHealingLocator.ts        # Core self-healing
│   └── EnhancedSelfHealingLocator.ts # AI-enhanced learning
├── testData/
│   └── credentials.ts               # Test credentials
├── playwright-fast-stable.config.ts # Main configuration
└── global-setup.ts                  # Network verification
```

## Test Coverage

- **Login workflow** with self-healing element detection
- **Dashboard access** validation after successful login
- **Error-free operation** with test credentials (1111111111)

## Performance

- **Execution time**: ~34 seconds
- **Success rate**: 100%
- **Network resilient**: Handles connectivity issues gracefully

## Development

```bash
npm install
npx playwright install
npx playwright test --config=playwright-fast-stable.config.ts
```

## CI/CD Pipeline

- **Automated Testing**: Runs on every push and pull request
- **Multi-Node Testing**: Tests against Node.js 18 and 20
- **Daily Health Checks**: Scheduled runs at 6 AM UTC
- **Security Audits**: Automated dependency vulnerability scanning
- **Markdown Linting**: Ensures documentation quality

## Status

✅ **Production Ready** - Optimized for CI/CD pipelines and fast feedback cycles.
