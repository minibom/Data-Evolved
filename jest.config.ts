// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './apps/web/', // Adjust if your Next.js app is elsewhere
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // if you have a setup file
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured by nextJest)
    '^@/components/(.*)$': '<rootDir>/apps/web/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/apps/web/src/lib/$1',
    '^@/context/(.*)$': '<rootDir>/apps/web/src/context/$1',
    '^@/hooks/(.*)$': '<rootDir>/apps/web/src/hooks/$1',
    '^@/app/(.*)$': '<rootDir>/apps/web/src/app/$1',
    '^@packages/(.*)$': '<rootDir>/packages/$1',
    '^@game-ai-flows/(.*)$': '<rootDir>/apps/game-ai-genkit/src/flows/$1',
  },
  // Add more Jest options here
  // For example, to ignore certain paths:
  // testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // transformIgnorePatterns: [
  //   '/node_modules/',
  //   '^.+\\.module\\.(css|sass|scss)$',
  // ],
  // collectCoverage: true,
  // coverageReporters: ["json", "lcov", "text", "clover"],
  // coverageDirectory: "<rootDir>/coverage/",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
