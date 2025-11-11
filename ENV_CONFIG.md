# Environment Configuration Guide

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your values:
```bash
# NTDP Portal Configuration
BASE_URL=https://portal-uat.ntdp-sa.com
SAUDI_ID=1111111111
EXPECTED_NAME=Dummy
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Portal base URL | `https://portal-uat.ntdp-sa.com` |
| `SAUDI_ID` | Valid Saudi ID for testing | `1111111111` |
| `EXPECTED_NAME` | Expected user name after login | `Dummy` |

## Usage

All tests now use environment variables:
- Base URL from `BASE_URL`
- Saudi ID from `SAUDI_ID` 
- Expected name from `EXPECTED_NAME`

## Running Tests

```bash
# Uses .env file automatically
npm test

# Override environment variables
BASE_URL=https://different-env.com SAUDI_ID=2222222222 npm test
```

## Security

- `.env` file is in `.gitignore` to prevent committing credentials
- Use `.env.example` as template for team members