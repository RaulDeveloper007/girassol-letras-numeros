import { describe, expect, it } from 'vitest'
import { avaliaCriterioDominio, contarSequenciaAtual } from './dominio.js'
import type { CriterioDominio, ResultadoFolha } from './tipos.js'

const criterio: CriterioDominio = { folhasConsecutivas: 3, acertoMinimo: 100, dentroDoTempoPadrao: true }

function folha(nota: number, tempoSegundos = 100, tempoPadraoSegundos = 300): ResultadoFolha {
  return { notaPrimeiraTentativa: nota, tempoSegundos, tempoPadraoSegundos }
}

describe('avaliaCriterioDominio', () => {
  it('não domina com menos folhas do que o exigido', () => {
    expect(avaliaCriterioDominio([folha(100), folha(100)], criterio)).toBe(false)
  })

  it('domina com N folhas seguidas em 100%, dentro do tempo', () => {
    expect(avaliaCriterioDominio([folha(100), folha(100), folha(100)], criterio)).toBe(true)
  })

  it('não domina se qualquer folha da janela não foi 100%', () => {
    expect(avaliaCriterioDominio([folha(100), folha(80), folha(100)], criterio)).toBe(false)
  })

  it('não domina se alguma folha da janela estourou o tempo padrão', () => {
    expect(avaliaCriterioDominio([folha(100), folha(100), folha(100, 400, 300)], criterio)).toBe(false)
  })

  it('olha só a janela mais recente — uma folha ruim antiga não impede o domínio depois', () => {
    const folhas = [folha(0), folha(100), folha(100), folha(100)]
    expect(avaliaCriterioDominio(folhas, criterio)).toBe(true)
  })

  it('ignora o tempo padrão quando o critério não exige isso', () => {
    const criterioSemTempo: CriterioDominio = { ...criterio, dentroDoTempoPadrao: false }
    const folhas = [folha(100, 999, 300), folha(100, 999, 300), folha(100, 999, 300)]
    expect(avaliaCriterioDominio(folhas, criterioSemTempo)).toBe(true)
  })

  it('tolera um pouco acima do tempo padrão (folga de 20%)', () => {
    // 350s com padrão de 300s é 16% acima -- ainda dentro da folga.
    const folhas = [folha(100, 350, 300), folha(100, 350, 300), folha(100, 350, 300)]
    expect(avaliaCriterioDominio(folhas, criterio)).toBe(true)
  })
})

describe('contarSequenciaAtual', () => {
  it('conta zero sem nenhuma folha', () => {
    expect(contarSequenciaAtual([], criterio)).toBe(0)
  })

  it('conta as folhas perfeitas mais recentes, da mais nova pra mais velha', () => {
    expect(contarSequenciaAtual([folha(80), folha(100), folha(100)], criterio)).toBe(2)
  })

  it('para na primeira folha (voltando no tempo) que não está dentro do critério', () => {
    expect(contarSequenciaAtual([folha(100), folha(80), folha(100)], criterio)).toBe(1)
  })

  it('não passa do tamanho da janela exigida mesmo com uma sequência maior', () => {
    expect(contarSequenciaAtual([folha(100), folha(100), folha(100), folha(100)], criterio)).toBe(3)
  })
})
