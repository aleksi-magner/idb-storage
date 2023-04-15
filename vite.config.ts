/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
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
  build: {
    outDir: 'dist',
    reportCompressedSize: false,
    minify: true,
    lib: {
      name: 'idb',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs'],
      fileName: () => 'index.js',
    },
  },
});
