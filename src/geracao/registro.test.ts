import { beforeEach, describe, expect, it } from 'vitest'
import { geradorRegistrado, GeradorNaoEncontradoError, limparRegistro, obterGerador, registrarGerador } from './registro.js'

beforeEach(() => {
  limparRegistro()
})

describe('registro de geradores', () => {
  it('registra e recupera um gerador pelo id', () => {
    const minhaFuncao = () => ({ tipo: 'numerico' as const, enunciado: 'x', dados: {}, gabarito: 1 })
    registrarGerador('teste.exemplo', minhaFuncao)
    expect(obterGerador('teste.exemplo')).toBe(minhaFuncao)
  })

  it('geradorRegistrado reflete o estado do registro', () => {
    expect(geradorRegistrado('nao.existe')).toBe(false)
    registrarGerador('teste.exemplo', () => ({ tipo: 'numerico', enunciado: 'x', dados: {}, gabarito: 1 }))
    expect(geradorRegistrado('teste.exemplo')).toBe(true)
  })

  it('lança GeradorNaoEncontradoError para um id não registrado', () => {
    expect(() => obterGerador('nao.existe')).toThrow(GeradorNaoEncontradoError)
  })
})
