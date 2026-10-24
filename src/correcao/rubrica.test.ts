import { describe, expect, it } from 'vitest'
import { avaliaRubrica, necessitaRevisaoDoOrientador, type Rubrica } from './rubrica.js'

const rubrica: Rubrica = {
  id: 'paragrafo-narrativo',
  criterios: [
    { id: 'coerencia', descricao: 'O texto faz sentido do início ao fim', pontos: 4 },
    { id: 'ortografia', descricao: 'Poucos ou nenhum erro de ortografia', pontos: 3 },
    { id: 'criatividade', descricao: 'Traz uma ideia própria', pontos: 3 },
  ],
}

describe('avaliaRubrica', () => {
  it('soma os pontos de cada critério', () => {
    const resultado = avaliaRubrica(rubrica, {
      rubricaId: rubrica.id,
      pontuacoesPorCriterio: { coerencia: 4, ortografia: 2, criatividade: 3 },
    })
    expect(resultado.pontos).toBe(9)
    expect(resultado.maximo).toBe(10)
    expect(resultado.percentual).toBe(90)
  })

  it('trata critério sem pontuação registrada como zero', () => {
    const resultado = avaliaRubrica(rubrica, { rubricaId: rubrica.id, pontuacoesPorCriterio: {} })
    expect(resultado.pontos).toBe(0)
  })

  it('não deixa um critério passar do máximo dele', () => {
    const resultado = avaliaRubrica(rubrica, {
      rubricaId: rubrica.id,
      pontuacoesPorCriterio: { coerencia: 999, ortografia: 0, criatividade: 0 },
    })
    expect(resultado.pontos).toBe(4)
  })

  it('não deixa pontuação negativa', () => {
    const resultado = avaliaRubrica(rubrica, {
      rubricaId: rubrica.id,
      pontuacoesPorCriterio: { coerencia: -5, ortografia: 0, criatividade: 0 },
    })
    expect(resultado.pontos).toBe(0)
  })
})

describe('necessitaRevisaoDoOrientador', () => {
  it('produção livre sempre vai para a fila do orientador', () => {
    expect(necessitaRevisaoDoOrientador()).toBe(true)
  })
})
