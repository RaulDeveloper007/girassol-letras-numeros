import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { ditadoPalavra } from './ditado-palavra.js'

describe('gerador portugues.ditado-palavra', () => {
  it('o texto falado e o gabarito são a palavra sorteada, mantendo o acento', () => {
    const rng = criarRng(1)
    const palavras = ['café', 'sofá', 'ônibus', 'árvore']
    for (let i = 0; i < 50; i++) {
      const item = ditadoPalavra(rng, { palavras })
      expect(palavras).toContain(item.gabarito)
      expect(item.dados.textoFala).toBe(item.gabarito)
    }
  })

  it('o enunciado visível é uma instrução fixa, não a palavra em si', () => {
    const rng = criarRng(2)
    const item = ditadoPalavra(rng, { palavras: ['café'] })
    expect(item.enunciado).toBe('Ouça com atenção e escreva a palavra certinha (com acento, se tiver).')
  })
})
