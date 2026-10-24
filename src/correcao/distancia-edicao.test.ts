import { describe, expect, it } from 'vitest'
import { distanciaDeEdicao, similaridade } from './distancia-edicao.js'

describe('distanciaDeEdicao', () => {
  it('é zero para strings idênticas', () => {
    expect(distanciaDeEdicao('gato', 'gato')).toBe(0)
  })

  it('conta uma substituição', () => {
    expect(distanciaDeEdicao('gato', 'pato')).toBe(1)
  })

  it('conta uma inserção', () => {
    expect(distanciaDeEdicao('gato', 'gatos')).toBe(1)
  })

  it('conta uma remoção', () => {
    expect(distanciaDeEdicao('gatos', 'gato')).toBe(1)
  })

  it('lida com string vazia', () => {
    expect(distanciaDeEdicao('', 'abc')).toBe(3)
    expect(distanciaDeEdicao('abc', '')).toBe(3)
  })

  it('é simétrica', () => {
    expect(distanciaDeEdicao('casa', 'caça')).toBe(distanciaDeEdicao('caça', 'casa'))
  })
})

describe('similaridade', () => {
  it('é 1 para strings idênticas', () => {
    expect(similaridade('escola', 'escola')).toBe(1)
  })

  it('é 1 para duas strings vazias', () => {
    expect(similaridade('', '')).toBe(1)
  })

  it('fica entre 0 e 1', () => {
    expect(similaridade('casa', 'xyz')).toBeGreaterThanOrEqual(0)
    expect(similaridade('casa', 'xyz')).toBeLessThanOrEqual(1)
  })
})
