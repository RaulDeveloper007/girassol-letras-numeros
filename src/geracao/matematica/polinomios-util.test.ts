import { describe, expect, it } from 'vitest'
import { avaliarPolinomio, derivarPolinomio, textoPolinomio } from './polinomios-util.js'

describe('avaliarPolinomio', () => {
  it('soma coeficiente × x^expoente de cada termo', () => {
    // f(x) = 2x² + 3x; f(4) = 32 + 12 = 44
    expect(avaliarPolinomio([{ coeficiente: 2, expoente: 2 }, { coeficiente: 3, expoente: 1 }], 4)).toBe(44)
  })
})

describe('derivarPolinomio', () => {
  it('aplica a regra do tombo em cada termo', () => {
    // d/dx (2x³ + 5x) = 6x² + 5
    const derivada = derivarPolinomio([{ coeficiente: 2, expoente: 3 }, { coeficiente: 5, expoente: 1 }])
    expect(derivada).toEqual([{ coeficiente: 6, expoente: 2 }, { coeficiente: 5, expoente: 0 }])
  })

  it('remove termos que a derivada zera (constantes)', () => {
    // d/dx (7) = 0 -- não deve sobrar um termo com coeficiente 0
    const derivada = derivarPolinomio([{ coeficiente: 7, expoente: 0 }])
    expect(derivada).toEqual([])
  })
})

describe('textoPolinomio', () => {
  it('monta o texto com sinais e expoentes corretos', () => {
    expect(textoPolinomio([{ coeficiente: 2, expoente: 2 }, { coeficiente: -3, expoente: 1 }])).toBe('2x^2 - 3x')
  })

  it('omite o x quando o expoente é 0', () => {
    expect(textoPolinomio([{ coeficiente: 5, expoente: 0 }])).toBe('5')
  })
})
