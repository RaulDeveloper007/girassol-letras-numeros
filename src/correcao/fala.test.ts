import { describe, expect, it } from 'vitest'
import {
  avaliaTentativaDeFala,
  decidirAposTentativaDeFala,
  MAX_TENTATIVAS_DE_FALA,
  TOLERANCIA_PADRAO_POR_ESTAGIO,
} from './fala.js'

describe('avaliaTentativaDeFala', () => {
  it('aceita uma transcrição idêntica à frase-alvo', () => {
    const resultado = avaliaTentativaDeFala('bom dia', 'bom dia', TOLERANCIA_PADRAO_POR_ESTAGIO.avancado)
    expect(resultado.aceito).toBe(true)
    expect(resultado.similaridade).toBe(1)
  })

  it('ignora acento e caixa (voz nunca "escreve" acento certo)', () => {
    const resultado = avaliaTentativaDeFala('BOA TARDE', 'boa tarde', TOLERANCIA_PADRAO_POR_ESTAGIO.avancado)
    expect(resultado.aceito).toBe(true)
  })

  it('no nível inicial, aceita uma pronúncia mais imperfeita do que no avançado', () => {
    // Exemplo controlado: 10 caracteres, 3 errados -> similaridade = 0.7.
    // Isso fica acima do limite do nível inicial (0.6) e abaixo dos limites
    // intermediário (0.75) e avançado (0.85).
    const alvo = 'aaaaaaaaaa'
    const transcricao = 'aaaaaaabbb'

    const resultadoInicial = avaliaTentativaDeFala(transcricao, alvo, TOLERANCIA_PADRAO_POR_ESTAGIO.inicial)
    const resultadoAvancado = avaliaTentativaDeFala(transcricao, alvo, TOLERANCIA_PADRAO_POR_ESTAGIO.avancado)

    expect(resultadoInicial.aceito).toBe(true)
    expect(resultadoAvancado.aceito).toBe(false)
  })

  it('rejeita algo completamente diferente da frase-alvo', () => {
    const resultado = avaliaTentativaDeFala('batata frita', 'bom dia', TOLERANCIA_PADRAO_POR_ESTAGIO.avancado)
    expect(resultado.aceito).toBe(false)
  })
})

describe('decidirAposTentativaDeFala', () => {
  const resultadoAceito = { aceito: true, similaridade: 1, transcricaoNormalizada: 'x' }
  const resultadoRejeitado = { aceito: false, similaridade: 0, transcricaoNormalizada: 'x' }

  it('aceita de primeira se a transcrição bateu', () => {
    expect(decidirAposTentativaDeFala(1, resultadoAceito)).toEqual({ tipo: 'aceito' })
  })

  it('manda tentar de novo enquanto não chegou no limite', () => {
    expect(decidirAposTentativaDeFala(1, resultadoRejeitado)).toEqual({ tipo: 'tentar-de-novo' })
    expect(decidirAposTentativaDeFala(MAX_TENTATIVAS_DE_FALA - 1, resultadoRejeitado)).toEqual({
      tipo: 'tentar-de-novo',
    })
  })

  it('encaminha pro orientador na 3ª tentativa sem sucesso', () => {
    expect(decidirAposTentativaDeFala(MAX_TENTATIVAS_DE_FALA, resultadoRejeitado)).toEqual({
      tipo: 'encaminhar-orientador',
    })
  })
})
