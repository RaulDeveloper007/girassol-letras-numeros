import type { ResultadoFolha } from './tipos.js'

export interface TendenciaSct {
  // Média de (tempo gasto / tempo padrão) nas folhas consideradas, em %.
  // 100 = exatamente no Tempo Padrão de Conclusão; abaixo de 100 = mais
  // rápido que o padrão.
  percentualDoTempoPadrao: number
  dentroDoTempoPadrao: boolean
}

/**
 * Registra a tendência do Tempo Padrão de Conclusão (SCT) do aluno neste
 * bloco: não é só "essa folha foi rápida ou lenta", é a média das folhas
 * recentes -- o mesmo sinal que, no método, orienta se o aluno está pronto
 * pra avançar de passo ou precisa de mais repetição antes disso.
 */
export function calcularTendenciaSct(folhasRecentes: ResultadoFolha[]): TendenciaSct | null {
  if (folhasRecentes.length === 0) return null

  const mediaProporcao =
    folhasRecentes.reduce((soma, folha) => soma + folha.tempoSegundos / folha.tempoPadraoSegundos, 0) / folhasRecentes.length

  return {
    percentualDoTempoPadrao: Math.round(mediaProporcao * 100),
    dentroDoTempoPadrao: mediaProporcao <= 1,
  }
}
