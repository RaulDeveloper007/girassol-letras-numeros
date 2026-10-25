import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  test: {
    setupFiles: ['./src/testes/configurar-indexeddb.ts'],
    // O primeiro import dinâmico do mathjs pode ficar lento quando muitos
    // workers do Vitest competem por CPU ao mesmo tempo (observado em
    // execuções com 70+ arquivos de teste em paralelo) -- 5s já flakou
    // mais de uma vez por isso, sem ser um problema real no código.
    testTimeout: 15000,
  },
})
