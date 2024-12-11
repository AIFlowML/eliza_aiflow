/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@ai16z/(.*)$': '<rootDir>/../packages/$1/src'
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    testTimeout: 10000,
    verbose: true
};