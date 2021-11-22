/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test-utils/jest.env.ts'],
  setupFilesAfterEnv: ['<rootDir>/test-utils/jest.setup.ts'],
};
