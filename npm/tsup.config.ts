import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    // Preserve 'use client' directives so Next.js app router knows
    // these are client components
    options.banner = {
      js: '"use client";',
    };
  },
});
