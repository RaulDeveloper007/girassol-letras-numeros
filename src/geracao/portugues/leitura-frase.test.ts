import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { leituraFrase } from './leitura-frase.js'

describe('gerador portugues.leitura-frase', () => {
  it('a fraseAlvo e o gabarito são a frase sorteada do banco, e o tipo é fala-leitura', () => {
    const rng = criarRng(1)
    const frases = ['O gato subiu no muro.', 'A bola é azul.']
    for (let i = 0; i < 50; i++) {
      const item = leituraFrase(rng, { frases })
      expect(frases).toContain(item.gabarito)
      expect(item.dados.fraseAlvo).toBe(item.gabarito)
      expect(item.tipo).toBe('fala-leitura')
    }
  })
})
