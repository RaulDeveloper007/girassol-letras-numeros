import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { integralDefinida } from './integral-definida.js'

describe('gerador matematica.integral-definida', () => {
  it('o gabarito bate com a integral exata do integrando sorteado, de 0 ao limite superior', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = integralDefinida(rng, {
        expoentesDisponiveis: [0, 1, 2],
        quantidadeTermos: 2,
        multiplicadorMax: 5,
        limiteSuperiorMax: 4,
      })
      const integrando = item.dados.integrando as { coeficiente: number; expoente: number }[]
      const limiteSuperior = item.dados.limiteSuperior as number

      // Integra analiticamente (coeficiente / (expoente+1)) × x^(expoente+1)
      // e avalia de 0 ao limite -- o termo em 0 sempre zera.
      const esperado = integrando.reduce(
        (soma, termo) => soma + (termo.coeficiente / (termo.expoente + 1)) * limiteSuperior ** (termo.expoente + 1),
        0
      )

      expect(item.gabarito).toBeCloseTo(esperado, 10)
      expect(Number.isInteger(item.gabarito as number)).toBe(true)
    }
  })
})
