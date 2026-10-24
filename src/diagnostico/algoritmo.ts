// Teste diagnóstico adaptativo: busca binária sobre uma sequência ordenada
// de blocos do currículo (do mais fácil ao mais difícil). Converge rápido
// (O(log N) perguntas) independente de quantos blocos o currículo tiver —
// e depois ainda faz perguntas extras de confirmação até bater um mínimo,
// pra não parecer (nem ser) raso demais em currículos com poucos blocos.
export interface TentativaDiagnostico {
  indice: number
  acertou: boolean
}

export interface EstadoDiagnostico {
  indiceMinimo: number // o aluno comprovadamente consegue até aqui
  indiceMaximo: number // limite ainda não descartado
  indiceAtual: number
  tentativas: TentativaDiagnostico[]
  minimoDePerguntas: number
}

export function iniciarDiagnostico(totalBlocos: number, minimoDePerguntas = 5): EstadoDiagnostico {
  if (totalBlocos <= 0) throw new Error('Não há blocos para diagnosticar.')

  return {
    indiceMinimo: -1, // -1 = ainda não comprovou nem o primeiro bloco
    indiceMaximo: totalBlocos - 1,
    indiceAtual: Math.floor((totalBlocos - 1) / 2),
    tentativas: [],
    minimoDePerguntas,
  }
}

export function registrarResposta(estado: EstadoDiagnostico, acertou: boolean): EstadoDiagnostico {
  const tentativas = [...estado.tentativas, { indice: estado.indiceAtual, acertou }]
  const jaConvergida = estado.indiceMinimo >= estado.indiceMaximo

  if (jaConvergida) {
    // O limite já foi encontrado; perguntas extras daqui pra frente são só
    // confirmação (pro resultado não depender de uma única resposta por
    // sorte/distração), e não mudam mais o índice atual.
    return { ...estado, tentativas }
  }

  const indiceMinimo = acertou ? estado.indiceAtual : estado.indiceMinimo
  const indiceMaximo = acertou ? estado.indiceMaximo : estado.indiceAtual - 1
  // Math.max(0, ...): se o aluno errar até o bloco mais fácil, a fórmula
  // pura daria -1 -- não é um índice válido pra perguntar/confirmar de novo.
  const indiceAtual = Math.max(0, Math.floor((indiceMinimo + indiceMaximo + 1) / 2))

  return { ...estado, indiceMinimo, indiceMaximo, indiceAtual, tentativas }
}

export function diagnosticoConcluido(estado: EstadoDiagnostico): boolean {
  const buscaConvergida = estado.indiceMinimo >= estado.indiceMaximo
  return buscaConvergida && estado.tentativas.length >= estado.minimoDePerguntas
}

/**
 * Posiciona o aluno ALGUNS blocos abaixo do limite comprovado (E1.3: ponto
 * de partida confortável), nunca exatamente no teto onde ele começou a
 * errar. Em currículos pequenos, uma margem fixa pode "engolir" o
 * resultado inteiro (ex.: limite=2, margem=2 sempre cairia no índice 0,
 * mesmo acertando tudo) — por isso a margem efetiva nunca passa de metade
 * do que o aluno comprovou.
 */
export function calcularIndiceDePartida(estado: EstadoDiagnostico, margemDeSeguranca = 2): number {
  const limiteComprovado = Math.max(estado.indiceMinimo, 0)
  const margemEfetiva = Math.min(margemDeSeguranca, Math.floor(limiteComprovado / 2))
  return Math.max(0, limiteComprovado - margemEfetiva)
}
