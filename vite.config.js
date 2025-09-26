import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills'

export default defineConfig({
  base: '/genoma/',
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  }
})