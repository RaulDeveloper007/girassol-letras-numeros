import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { derivadaEmPonto } from './derivada-em-ponto.js'
import { avaliarPolinomio, derivarPolinomio, type TermoPolinomio } from './polinomios-util.js'

describe('gerador matematica.derivada-em-ponto', () => {
  it('o gabarito bate com a derivada do polinômio sorteado, avaliada no ponto', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = derivadaEmPonto(rng, { expoentesDisponiveis: [1, 2, 3], quantidadeTermos: 2, coeficienteMax: 6, pontoMax: 5 })
      const termos = item.dados.termos as TermoPolinomio[]
      const x0 = item.dados.x0 as number
      const derivadaEsperada = avaliarPolinomio(derivarPolinomio(termos), x0)
      expect(item.gabarito).toBe(derivadaEsperada)
    }
  })
})
