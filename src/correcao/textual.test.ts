import { describe, expect, it } from 'vitest'
import { avaliaTextual, normalizarTexto } from './textual.js'

describe('normalizarTexto', () => {
  it('por padrão ignora caixa e espaços nas pontas', () => {
    expect(normalizarTexto('  CASA  ')).toBe('casa')
  })

  it('colapsa espaços duplicados', () => {
    expect(normalizarTexto('a   b')).toBe('a b')
  })

  it('não mexe em acentos por padrão', () => {
    expect(normalizarTexto('árvore')).toBe('árvore')
  })

  it('remove acentos quando normalizarAcentos é true', () => {
    expect(normalizarTexto('árvore', { normalizarAcentos: true })).toBe('arvore')
  })
})

describe('avaliaTextual', () => {
  it('aceita resposta exata', () => {
    const resultado = avaliaTextual('lagoa', 'lagoa')
    expect(resultado.correto).toBe(true)
    expect(resultado.distancia).toBe(0)
  })

  it('é tolerante a caixa e espaços por padrão', () => {
    expect(avaliaTextual('  LAGOA  ', 'lagoa').correto).toBe(true)
  })

  it('rejeita erro de ortografia quando a distância máxima é 0', () => {
    expect(avaliaTextual('lagoaa', 'lagoa', { distanciaMaximaAceita: 0 }).correto).toBe(false)
  })

  it('aceita erro pequeno quando a distância máxima permite', () => {
    expect(avaliaTextual('lagoaa', 'lagoa', { distanciaMaximaAceita: 1 }).correto).toBe(true)
  })

  it('aceita uma variante válida além do gabarito principal', () => {
    const resultado = avaliaTextual('vermelha', 'vermelho', { variantesAceitas: ['vermelha'] })
    expect(resultado.correto).toBe(true)
    expect(resultado.candidatoMaisProximo).toBe('vermelha')
  })

  it('não confunde acento com erro quando normalizarAcentos está desligado (ortografia)', () => {
    // "arvore" sem acento NÃO deve passar como "árvore" certo, por padrão.
    expect(avaliaTextual('arvore', 'árvore').correto).toBe(false)
  })
})
