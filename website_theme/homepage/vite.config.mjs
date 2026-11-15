import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: directory,
  base: '/homepage/',
  plugins: [tailwindcss()],
  resolve: {alias: {
    '@': path.join(directory, 'src'),
    '@tanstack/react-router': path.join(directory, 'src/router-compat.tsx'),
  }},
  esbuild: {jsx: 'automatic'},
  build: {outDir: path.resolve(directory, '../../frontend/homepage'), emptyOutDir: true},
});
