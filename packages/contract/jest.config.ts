import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '@client(.*)': '<rootDir>/.client/$1',
  },
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  verbose: true,
};

export default config;
