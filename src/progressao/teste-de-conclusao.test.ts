import { describe, expect, it } from 'vitest'
import { avaliaTesteDeConclusao, blocosComErro, itensErrados } from './teste-de-conclusao.js'

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

describe('blocosComErro', () => {
  it('retorna os blocos distintos que tiveram item errado, sem repetir e na ordem de aparição', () => {
    const itens = [
      { id: 'a', correto: true, blocoId: 'bloco-1' },
      { id: 'b', correto: false, blocoId: 'bloco-2' },
      { id: 'c', correto: false, blocoId: 'bloco-2' },
      { id: 'd', correto: false, blocoId: 'bloco-3' },
    ]
    expect(blocosComErro(itens)).toEqual(['bloco-2', 'bloco-3'])
  })

  it('ignora itens sem blocoId e retorna lista vazia quando tudo está correto', () => {
    expect(blocosComErro([{ id: 'a', correto: true, blocoId: 'bloco-1' }])).toEqual([])
    expect(blocosComErro([{ id: 'a', correto: false }])).toEqual([])
  })
})
