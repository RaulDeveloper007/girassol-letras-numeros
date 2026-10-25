// Setup do Vitest: o Dexie (motor de persistência das Etapas 11+) espera um
// indexedDB global, que só existe de verdade num navegador. Esse polyfill
// deixa os testes de src/dados/ rodarem em Node sem precisar de um browser
// real ou de jsdom.
import 'fake-indexeddb/auto'
