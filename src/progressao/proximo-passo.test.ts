import { describe, expect, it } from 'vitest'
import { decidirProximoPasso } from './proximo-passo.js'
import type { CriterioDominio, ResultadoFolha } from './tipos.js'

const criterio: CriterioDominio = { folhasConsecutivas: 2, acertoMinimo: 100, dentroDoTempoPadrao: false }
const folhasBoas: ResultadoFolha[] = [
  { notaPrimeiraTentativa: 100, tempoSegundos: 100, tempoPadraoSegundos: 300 },
  { notaPrimeiraTentativa: 100, tempoSegundos: 100, tempoPadraoSegundos: 300 },
]
const folhasRuins: ResultadoFolha[] = [
  { notaPrimeiraTentativa: 100, tempoSegundos: 100, tempoPadraoSegundos: 300 },
  { notaPrimeiraTentativa: 60, tempoSegundos: 100, tempoPadraoSegundos: 300 },
]

describe('decidirProximoPasso', () => {
  it('repete o bloco quando ainda não dominou', () => {
    const passo = decidirProximoPasso({ folhasRecentes: folhasRuins, criterio, proximoBlocoId: 'b2' })
    expect(passo).toEqual({ tipo: 'repetir-bloco' })
  })

  it('avança pro próximo bloco quando dominou e existe um próximo bloco', () => {
    const passo = decidirProximoPasso({ folhasRecentes: folhasBoas, criterio, proximoBlocoId: 'b2' })
    expect(passo).toEqual({ tipo: 'avancar-bloco', proximoBlocoId: 'b2' })
  })

  it('manda pro teste de conclusão quando dominou e era o último bloco do nível', () => {
    const passo = decidirProximoPasso({ folhasRecentes: folhasBoas, criterio, proximoBlocoId: null })
    expect(passo).toEqual({ tipo: 'teste-de-conclusao' })
  })
})
