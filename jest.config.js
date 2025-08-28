// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // setup file
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle CSS/SCSS imports (mock them)
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};

module.exports = createJestConfig(customJestConfig);
