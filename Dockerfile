# Docker configuration for CI/CD
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create .env file from environment variables
RUN echo "BASE_URL=${BASE_URL:-https://portal-uat.ntdp-sa.com}" > .env && \
    echo "SAUDI_ID=${SAUDI_ID:-1111111111}" >> .env && \
    echo "EXPECTED_NAME=${EXPECTED_NAME:-Dummy}" >> .env

# Run tests
CMD ["npx", "playwright", "test"]