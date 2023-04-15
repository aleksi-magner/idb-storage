/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    dir: 'src/',
    setupFiles: ['fake-indexeddb/auto'],
    passWithNoTests: true,
    watch: false,
    clearMocks: true,
    mockReset: true,
    restoreMocks: false,
    logHeapUsage: false,
    reporters: 'default',
    css: false,
    coverage: {
      enabled: true,
      provider: 'c8',
      all: true,
      clean: true,
      cleanOnRerun: true,
      skipFull: false,
      perFile: false,
      excludeNodeModules: true,
      include: ['**/src/**'],
      reporter: ['text'],
    },
  },
});
