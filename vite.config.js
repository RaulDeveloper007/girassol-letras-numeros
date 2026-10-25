import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  test: {
    setupFiles: ['./src/testes/configurar-indexeddb.ts'],
  },
})
