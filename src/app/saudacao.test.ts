import { describe, expect, it } from 'vitest'
import { saudacaoPorHorario } from './saudacao.js'

function as(hora: number, minuto = 0): Date {
  return new Date(2026, 9, 26, hora, minuto)
}

describe('saudacaoPorHorario', () => {
  it('diz bom dia de 05h00 até 11h59', () => {
    expect(saudacaoPorHorario(as(5, 0))).toBe('Bom dia')
    expect(saudacaoPorHorario(as(11, 59))).toBe('Bom dia')
  })

  it('diz boa tarde de 12h00 até 17h59', () => {
    expect(saudacaoPorHorario(as(12, 0))).toBe('Boa tarde')
    expect(saudacaoPorHorario(as(17, 59))).toBe('Boa tarde')
  })

  it('diz boa noite de 18h00 até 04h59, incluindo a madrugada', () => {
    expect(saudacaoPorHorario(as(18, 0))).toBe('Boa noite')
    expect(saudacaoPorHorario(as(23, 59))).toBe('Boa noite')
    expect(saudacaoPorHorario(as(0, 0))).toBe('Boa noite')
    expect(saudacaoPorHorario(as(4, 59))).toBe('Boa noite')
  })
})
