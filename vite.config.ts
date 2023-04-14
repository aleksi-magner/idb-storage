/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

export default defineConfig({
  plugins: [dts({ outputDir: 'dist/types' })],
  test: {
    environment: 'happy-dom',
    dir: 'tests/',
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
      reportsDirectory: 'tests/__coverage__',
      reporter: ['text', 'json-summary'],
    },
  },
  build: {
    outDir: 'dist',
    reportCompressedSize: false,
    minify: true,
    lib: {
      name: 'idb',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['iife'],
      fileName: () => `${pkg.name}.js`,
    },
  },
});
