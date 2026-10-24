export interface CriterioRubrica {
  id: string
  descricao: string
  pontos: number
}

export interface Rubrica {
  id: string
  criterios: CriterioRubrica[]
}

export interface Autoavaliacao {
  rubricaId: string
  pontuacoesPorCriterio: Record<string, number>
}

export interface ResultadoRubrica {
  pontos: number
  maximo: number
  percentual: number
}

export function avaliaRubrica(rubrica: Rubrica, autoavaliacao: Autoavaliacao): ResultadoRubrica {
  const maximo = rubrica.criterios.reduce((soma, criterio) => soma + criterio.pontos, 0)

  const pontos = rubrica.criterios.reduce((soma, criterio) => {
    const dado = autoavaliacao.pontuacoesPorCriterio[criterio.id] ?? 0
    const limitado = Math.max(0, Math.min(dado, criterio.pontos))
    return soma + limitado
  }, 0)

  return {
    pontos,
    maximo,
    percentual: maximo > 0 ? Math.round((pontos / maximo) * 100) : 0,
  }
}

/**
 * Produção livre nunca é corrigida automaticamente de verdade — a
 * autoavaliação é só um primeiro sinal pro próprio aluno. Todo item desse
 * tipo entra na fila de revisão do orientador, sempre.
 */
export function necessitaRevisaoDoOrientador(): true {
  return true
}
