import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc'
import wasm from "vite-plugin-wasm";

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  plugins: [react({ tsDecorators: true }), wasm()],
});