/**
 * Test data for login scenarios - loaded from environment variables
 */

export const validCredentials = {
  saudiId: process.env.SAUDI_ID || '1111111111',
  expectedName: process.env.EXPECTED_NAME || 'Dummy'
};

export const invalidCredentials = {
  emptySaudiId: '',
  invalidFormat: '123',
  nonExistentId: '9999999999'
};

export const testUsers = {
  dummyUser: {
    id: process.env.SAUDI_ID || '1111111111',
    name: process.env.EXPECTED_NAME || 'Dummy'
  }
};

export const config = {
  baseUrl: process.env.BASE_URL || 'https://portal-uat.ntdp-sa.com'
};
