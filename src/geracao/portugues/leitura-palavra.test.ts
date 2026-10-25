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

  it('usa pt-BR por padrão, mas aceita outro idioma (reaproveitado pelo conteúdo de Inglês)', () => {
    const rng = criarRng(2)
    expect(leituraPalavra(rng, { palavras: ['gato'] }).dados.idioma).toBe('pt-BR')
    expect(leituraPalavra(rng, { palavras: ['cat'], idioma: 'en-US' }).dados.idioma).toBe('en-US')
  })
})
