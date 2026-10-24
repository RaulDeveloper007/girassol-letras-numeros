import { describe, expect, it } from 'vitest'
import { criarRng, embaralhar, escolherInteiro, escolherUm } from './aleatorio.js'

describe('criarRng', () => {
  it('a mesma semente sempre produz a mesma sequência', () => {
    const a = criarRng(42)
    const b = criarRng(42)
    const sequenciaA = Array.from({ length: 5 }, () => a())
    const sequenciaB = Array.from({ length: 5 }, () => b())
    expect(sequenciaA).toEqual(sequenciaB)
  })

  it('sementes diferentes tendem a produzir sequências diferentes', () => {
    const a = criarRng(1)
    const b = criarRng(2)
    expect(a()).not.toBe(b())
  })

  it('produz valores no intervalo [0, 1)', () => {
    const rng = criarRng(7)
    for (let i = 0; i < 100; i++) {
      const valor = rng()
      expect(valor).toBeGreaterThanOrEqual(0)
      expect(valor).toBeLessThan(1)
    }
  })
})

describe('escolherInteiro', () => {
  it('nunca sai do intervalo [min, max]', () => {
    const rng = criarRng(123)
    for (let i = 0; i < 200; i++) {
      const valor = escolherInteiro(rng, 3, 7)
      expect(valor).toBeGreaterThanOrEqual(3)
      expect(valor).toBeLessThanOrEqual(7)
    }
  })

  it('funciona quando min === max', () => {
    const rng = criarRng(1)
    expect(escolherInteiro(rng, 5, 5)).toBe(5)
  })
})

describe('escolherUm', () => {
  it('sempre retorna um item da lista', () => {
    const rng = criarRng(5)
    const itens = ['a', 'b', 'c']
    for (let i = 0; i < 20; i++) {
      expect(itens).toContain(escolherUm(rng, itens))
    }
  })

  it('lança erro com lista vazia', () => {
    const rng = criarRng(5)
    expect(() => escolherUm(rng, [])).toThrow()
  })
})

describe('embaralhar', () => {
  it('mantém os mesmos elementos, só muda a ordem', () => {
    const rng = criarRng(9)
    const original = [1, 2, 3, 4, 5]
    const embaralhado = embaralhar(rng, original)
    expect(embaralhado).toHaveLength(original.length)
    expect([...embaralhado].sort()).toEqual([...original].sort())
  })

  it('não modifica o array original', () => {
    const rng = criarRng(9)
    const original = [1, 2, 3]
    embaralhar(rng, original)
    expect(original).toEqual([1, 2, 3])
  })
})
