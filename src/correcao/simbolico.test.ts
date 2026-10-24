import { describe, expect, it } from 'vitest'
import { avaliaIntegralIndefinida, avaliaNumerico, avaliaSimbolico, equivalentesSimbolicamente } from './simbolico.js'

describe('avaliaNumerico', () => {
  it('aceita um número exatamente igual ao gabarito', async () => {
    expect((await avaliaNumerico('7', 7)).correto).toBe(true)
  })

  it('aceita uma expressão que avalia pro gabarito', async () => {
    expect((await avaliaNumerico('3 + 4', 7)).correto).toBe(true)
  })

  it('aceita fração equivalente a decimal', async () => {
    expect((await avaliaNumerico('1/2', 0.5)).correto).toBe(true)
  })

  it('rejeita um valor diferente', async () => {
    expect((await avaliaNumerico('8', 7)).correto).toBe(false)
  })

  it('rejeita texto que não é uma expressão válida', async () => {
    const resultado = await avaliaNumerico('não sei', 7)
    expect(resultado.correto).toBe(false)
    expect(resultado.detalhe).toBeTruthy()
  })

  it('aceita decimal com vírgula (notação pt-BR)', async () => {
    expect((await avaliaNumerico('3,5', 3.5)).correto).toBe(true)
  })

  it('rejeita decimal com vírgula que não bate com o gabarito', async () => {
    expect((await avaliaNumerico('3,5', 4.2)).correto).toBe(false)
  })
})

describe('equivalentesSimbolicamente', () => {
  it('aceita formas algebricamente equivalentes', async () => {
    expect(await equivalentesSimbolicamente('2x + 4', '2*(x + 2)')).toBe(true)
  })

  it('rejeita expressões diferentes', async () => {
    expect(await equivalentesSimbolicamente('2x + 4', '2x + 5')).toBe(false)
  })

  it('funciona com mais de uma variável', async () => {
    expect(await equivalentesSimbolicamente('x*y + x', 'x*(y+1)', { variaveis: ['x', 'y'] })).toBe(true)
  })
})

describe('avaliaSimbolico', () => {
  it('aceita e explica quando a forma é equivalente mas não idêntica', async () => {
    const resultado = await avaliaSimbolico('2*(x+2)', '2x + 4')
    expect(resultado.correto).toBe(true)
    expect(resultado.detalhe).toContain('equivalente')
  })
})

describe('avaliaIntegralIndefinida', () => {
  it('aceita a antiderivada certa, com qualquer constante', async () => {
    // integral de 2x é x^2 (+ C) -- aqui o aluno nem escreveu o +C.
    expect((await avaliaIntegralIndefinida('x^2', '2x')).correto).toBe(true)
  })

  it('aceita a antiderivada mesmo com uma constante explícita', async () => {
    expect((await avaliaIntegralIndefinida('x^2 + 5', '2x')).correto).toBe(true)
  })

  it('rejeita uma antiderivada errada', async () => {
    expect((await avaliaIntegralIndefinida('x^3', '2x')).correto).toBe(false)
  })
})
