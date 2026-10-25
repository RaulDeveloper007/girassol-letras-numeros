import { describe, expect, it } from 'vitest'
import { carregarFase } from '../curriculo/loader.js'
import { decidirProximoPassoNoCurriculo } from './orquestracao.js'

const CRITERIO = { folhasConsecutivas: 3, acertoMinimo: 100 as const, dentroDoTempoPadrao: false }
const FOLHAS_DOMINADAS = [
  { notaPrimeiraTentativa: 100, tempoSegundos: 10, tempoPadraoSegundos: 100 },
  { notaPrimeiraTentativa: 100, tempoSegundos: 10, tempoPadraoSegundos: 100 },
  { notaPrimeiraTentativa: 100, tempoSegundos: 10, tempoPadraoSegundos: 100 },
]

describe('decidirProximoPassoNoCurriculo', () => {
  it('avança pro próximo bloco quando ele está no mesmo nível', async () => {
    const fase = await carregarFase('matematica', 1)
    // mat-f01-n01-b01 -> mat-f01-n01-b02, ambos no nível 1.
    const passo = decidirProximoPassoNoCurriculo({
      fase,
      blocoAtualId: 'mat-f01-n01-b01',
      folhasRecentes: FOLHAS_DOMINADAS,
      criterio: CRITERIO,
    })
    expect(passo).toEqual({ tipo: 'avancar-bloco', proximoBlocoId: 'mat-f01-n01-b02' })
  })

  it('pede teste de conclusão quando o próximo bloco já é de outro nível, mesmo a fase tendo mais blocos', async () => {
    const fase = await carregarFase('matematica', 1)
    // mat-f01-n01-b03 -> mat-f01-n02-b01 (confirmado em curriculo/loader.test.ts)
    // -- cruza nível, então precisa de teste mesmo sem ser o fim da fase.
    const passo = decidirProximoPassoNoCurriculo({
      fase,
      blocoAtualId: 'mat-f01-n01-b03',
      folhasRecentes: FOLHAS_DOMINADAS,
      criterio: CRITERIO,
    })
    expect(passo).toEqual({ tipo: 'teste-de-conclusao' })
  })

  it('pede teste de conclusão no último bloco da fase inteira', async () => {
    const fase = await carregarFase('matematica', 1)
    const passo = decidirProximoPassoNoCurriculo({
      fase,
      blocoAtualId: 'mat-f01-n05-b02',
      folhasRecentes: FOLHAS_DOMINADAS,
      criterio: CRITERIO,
    })
    expect(passo).toEqual({ tipo: 'teste-de-conclusao' })
  })

  it('pede repetição quando o critério de domínio ainda não foi atingido', async () => {
    const fase = await carregarFase('matematica', 1)
    const folhasFracas = [{ notaPrimeiraTentativa: 80, tempoSegundos: 10, tempoPadraoSegundos: 100 }]
    const passo = decidirProximoPassoNoCurriculo({
      fase,
      blocoAtualId: 'mat-f01-n01-b01',
      folhasRecentes: folhasFracas,
      criterio: CRITERIO,
    })
    expect(passo).toEqual({ tipo: 'repetir-bloco' })
  })
})
