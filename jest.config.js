module.exports = {
  setupFiles: ['fake-indexeddb/auto'],
  roots: ['<rootDir>/src/'],
  testMatch: ['**/src/**/*.spec.js'],
  moduleFileExtensions: ['js'],
  testEnvironment: 'jsdom',
  injectGlobals: false,
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/index.js'],
  coverageProvider: 'v8',
  coverageReporters: [
    [
      'text',
      {
        skipFull: false,
        skipEmpty: false,
      },
    ],
  ],
};
