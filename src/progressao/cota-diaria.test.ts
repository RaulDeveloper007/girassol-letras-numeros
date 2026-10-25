import { describe, expect, it } from 'vitest'
import { cotaDiariaAtingida, FOLHAS_POR_DIA_POR_DISCIPLINA } from './cota-diaria.js'

describe('cotaDiariaAtingida', () => {
  it('não está atingida antes da cota', () => {
    expect(cotaDiariaAtingida(FOLHAS_POR_DIA_POR_DISCIPLINA - 1)).toBe(false)
  })

  it('está atingida exatamente na cota e acima dela', () => {
    expect(cotaDiariaAtingida(FOLHAS_POR_DIA_POR_DISCIPLINA)).toBe(true)
    expect(cotaDiariaAtingida(FOLHAS_POR_DIA_POR_DISCIPLINA + 5)).toBe(true)
  })
})
