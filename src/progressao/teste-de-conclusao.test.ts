import { describe, expect, it } from 'vitest'
import { avaliaTesteDeConclusao, itensErrados } from './teste-de-conclusao.js'

describe('avaliaTesteDeConclusao', () => {
  it('aprova só com 100%', () => {
    expect(avaliaTesteDeConclusao([{ id: '1', correto: true }, { id: '2', correto: true }])).toBe('aprovado')
  })

  it('reprova com qualquer erro, mesmo um só', () => {
    expect(avaliaTesteDeConclusao([{ id: '1', correto: true }, { id: '2', correto: false }])).toBe('reprovado')
  })

  it('lança erro se não houver itens', () => {
    expect(() => avaliaTesteDeConclusao([])).toThrow()
  })
})

describe('itensErrados', () => {
  it('retorna só os ids dos itens errados, na ordem original', () => {
    const itens = [
      { id: 'a', correto: true },
      { id: 'b', correto: false },
      { id: 'c', correto: false },
    ]
    expect(itensErrados(itens)).toEqual(['b', 'c'])
  })

  it('retorna lista vazia quando tudo está correto', () => {
    expect(itensErrados([{ id: 'a', correto: true }])).toEqual([])
  })
})
