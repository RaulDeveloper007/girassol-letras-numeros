import { describe, expect, it } from 'vitest'
import { calcularProximaRevisao, proximoIntervaloDias } from './revisao-espacada.js'

describe('proximoIntervaloDias', () => {
  it('começa em 1 dia quando erra', () => {
    expect(proximoIntervaloDias(30, false)).toBe(1)
  })

  it('cresce pro próximo intervalo da escala quando acerta', () => {
    expect(proximoIntervaloDias(1, true)).toBe(3)
    expect(proximoIntervaloDias(3, true)).toBe(7)
    expect(proximoIntervaloDias(7, true)).toBe(14)
  })

  it('não passa do maior intervalo da escala', () => {
    expect(proximoIntervaloDias(60, true)).toBe(60)
  })

  it('trata um intervalo desconhecido como se fosse o início', () => {
    expect(proximoIntervaloDias(999, true)).toBe(1)
  })
})

describe('calcularProximaRevisao', () => {
  it('soma os dias corretamente, inclusive virando o mês', () => {
    const base = new Date('2026-01-30T00:00:00Z')
    const proxima = calcularProximaRevisao(base, 3)
    expect(proxima.toISOString().slice(0, 10)).toBe('2026-02-02')
  })
})
