import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { formarPalavra } from './formar-palavra.js'

describe('gerador portugues.formar-palavra', () => {
  it('o enunciado mostra as sílabas sorteadas, e o gabarito é a palavra correspondente', () => {
    const rng = criarRng(1)
    const palavras = [
      { silabas: ['BO', 'LA'], palavra: 'bola' },
      { silabas: ['SA', 'PO'], palavra: 'sapo' },
    ]
    for (let i = 0; i < 50; i++) {
      const item = formarPalavra(rng, { palavras })
      const escolhida = palavras.find((p) => p.palavra === item.gabarito)
      expect(escolhida).toBeDefined()
      expect(item.enunciado).toBe(`Junte as sílabas e escreva a palavra: ${escolhida!.silabas.join(' - ')}`)
    }
  })
})
