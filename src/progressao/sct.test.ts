import { describe, expect, it } from 'vitest'
import { calcularTendenciaSct } from './sct.js'

describe('calcularTendenciaSct', () => {
  it('retorna null sem folhas', () => {
    expect(calcularTendenciaSct([])).toBeNull()
  })

  it('calcula a média da proporção tempo gasto / tempo padrão, em %', () => {
    const folhas = [
      { notaPrimeiraTentativa: 100, tempoSegundos: 60, tempoPadraoSegundos: 60 }, // 100%
      { notaPrimeiraTentativa: 100, tempoSegundos: 90, tempoPadraoSegundos: 60 }, // 150%
    ]
    expect(calcularTendenciaSct(folhas)).toEqual({ percentualDoTempoPadrao: 125, dentroDoTempoPadrao: false })
  })

  it('marca dentroDoTempoPadrao quando a média não passa de 100%', () => {
    const folhas = [{ notaPrimeiraTentativa: 100, tempoSegundos: 50, tempoPadraoSegundos: 60 }]
    const tendencia = calcularTendenciaSct(folhas)
    expect(tendencia?.dentroDoTempoPadrao).toBe(true)
  })
})
