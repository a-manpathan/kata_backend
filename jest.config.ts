import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  // Use simple transform settings
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;