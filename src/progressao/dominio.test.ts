import { describe, expect, it } from 'vitest'
import { avaliaCriterioDominio } from './dominio.js'
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
})
