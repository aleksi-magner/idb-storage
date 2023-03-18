module.exports = {
  setupFiles: ['fake-indexeddb/auto'],
  moduleFileExtensions: ['js'],
  testEnvironment: 'jsdom',
  injectGlobals: false,
  bail: true,
  errorOnDeprecated: true,
  clearMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/idb.js'],
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
  coverageDirectory: '<rootDir>/__coverage__',
};
