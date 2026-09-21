module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/env.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
};
