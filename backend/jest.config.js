// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalTeardown: '<rootDir>/__tests__/setup/tearDown.ts',
    testTimeout: 60000,
    roots: ['<rootDir>/src', '<rootDir>/__tests__/unit', '<rootDir>/__tests__/integration'],
    coverageProvider: 'v8'
}
