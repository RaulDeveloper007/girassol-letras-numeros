// Teste diagnóstico adaptativo: busca binária sobre uma sequência ordenada
// de blocos do currículo (do mais fácil ao mais difícil). Converge em
// O(log N) perguntas, independente de quantos blocos o currículo já tiver
// — funciona igual com 3 blocos ou com 3000.
export interface TentativaDiagnostico {
  indice: number
  acertou: boolean
}

export interface EstadoDiagnostico {
  indiceMinimo: number // o aluno comprovadamente consegue até aqui
  indiceMaximo: number // limite ainda não descartado
  indiceAtual: number
  tentativas: TentativaDiagnostico[]
}

export function iniciarDiagnostico(totalBlocos: number): EstadoDiagnostico {
  if (totalBlocos <= 0) throw new Error('Não há blocos para diagnosticar.')

  return {
    indiceMinimo: -1, // -1 = ainda não comprovou nem o primeiro bloco
    indiceMaximo: totalBlocos - 1,
    indiceAtual: Math.floor((totalBlocos - 1) / 2),
    tentativas: [],
  }
}

export function registrarResposta(estado: EstadoDiagnostico, acertou: boolean): EstadoDiagnostico {
  const tentativas = [...estado.tentativas, { indice: estado.indiceAtual, acertou }]

  const indiceMinimo = acertou ? estado.indiceAtual : estado.indiceMinimo
  const indiceMaximo = acertou ? estado.indiceMaximo : estado.indiceAtual - 1

  const indiceAtual = Math.floor((indiceMinimo + indiceMaximo + 1) / 2)

  return { indiceMinimo, indiceMaximo, indiceAtual, tentativas }
}

export function diagnosticoConcluido(estado: EstadoDiagnostico): boolean {
  return estado.indiceMinimo >= estado.indiceMaximo
}

/**
 * Posiciona o aluno ALGUNS blocos abaixo do limite comprovado (E1.3: ponto
 * de partida confortável), nunca exatamente no teto onde ele começou a
 * errar. Nunca fica negativo.
 */
export function calcularIndiceDePartida(estado: EstadoDiagnostico, margemDeSeguranca = 2): number {
  const limiteComprovado = Math.max(estado.indiceMinimo, 0)
  return Math.max(0, limiteComprovado - margemDeSeguranca)
}
