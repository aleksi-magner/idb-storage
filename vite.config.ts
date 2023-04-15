/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outputDir: './dist',
    }),
  ],
  build: {
    lib: {
      name: 'purejs-idb',
      entry: resolve(__dirname, './src/index.ts'),
      fileName: format => `index.${format}.js`,
    },
  },
  test: {
    environment: 'happy-dom',
    dir: './src/',
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
