import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { pontuacaoCorrigir } from './pontuacao-corrigir.js'

describe('gerador portugues.pontuacao-corrigir', () => {
  it('o enunciado mostra a frase errada, e o gabarito é a versão corrigida', () => {
    const rng = criarRng(1)
    const frases = [
      { errada: 'o gato subiu no muro', correta: 'O gato subiu no muro.' },
      { errada: 'você já fez a lição', correta: 'Você já fez a lição?' },
    ]
    for (let i = 0; i < 50; i++) {
      const item = pontuacaoCorrigir(rng, { frases })
      const escolhida = frases.find((f) => f.correta === item.gabarito)
      expect(escolhida).toBeDefined()
      expect(item.enunciado).toContain(escolhida!.errada)
    }
  })

  it('desliga a normalização de maiúscula/minúscula na correção (é o que está sendo testado)', () => {
    const rng = criarRng(2)
    const item = pontuacaoCorrigir(rng, { frases: [{ errada: 'o gato subiu no muro', correta: 'O gato subiu no muro.' }] })
    expect(item.dados.regrasTextuais).toEqual({ normalizarCaixa: false })
  })
})
