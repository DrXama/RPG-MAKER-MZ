/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const {
  resolve
} = require('path');

module.exports = {
  roots: ['<rootDir>'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    "^@/app/(.+)$": "<rootDir>/ts/$1"
  },
  testMatch: [
    "**/**/*.spec.ts",
  ],
};
