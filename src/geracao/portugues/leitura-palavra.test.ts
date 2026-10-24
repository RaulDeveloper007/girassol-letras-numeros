import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { leituraPalavra } from './leitura-palavra.js'

describe('gerador portugues.leitura-palavra', () => {
  it('a fraseAlvo e o gabarito são a palavra sorteada do banco, e o tipo é fala-leitura', () => {
    const rng = criarRng(1)
    const palavras = ['gato', 'bola', 'sapo', 'mesa']
    for (let i = 0; i < 50; i++) {
      const item = leituraPalavra(rng, { palavras })
      expect(palavras).toContain(item.gabarito)
      expect(item.dados.fraseAlvo).toBe(item.gabarito)
      expect(item.tipo).toBe('fala-leitura')
    }
  })
})
