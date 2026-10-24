import { describe, expect, it } from 'vitest'
import {
  calcularIndiceDePartida,
  diagnosticoConcluido,
  iniciarDiagnostico,
  registrarResposta,
  type EstadoDiagnostico,
} from './algoritmo.js'

/** Simula um aluno cujo limite real é "consegue até este índice, inclusive". */
function rodarDiagnostico(totalBlocos: number, limiteReal: number, minimoDePerguntas = 5) {
  let estado = iniciarDiagnostico(totalBlocos, minimoDePerguntas)
  let passos = 0

  while (!diagnosticoConcluido(estado)) {
    const acertou = estado.indiceAtual <= limiteReal
    estado = registrarResposta(estado, acertou)
    passos += 1
    if (passos > 50) throw new Error('não convergiu -- provável bug infinito')
  }

  return { estadoFinal: estado, passos }
}

describe('iniciarDiagnostico', () => {
  it('começa no meio da faixa disponível', () => {
    const estado = iniciarDiagnostico(20)
    expect(estado.indiceAtual).toBe(9)
    expect(estado.indiceMinimo).toBe(-1)
    expect(estado.indiceMaximo).toBe(19)
  })

  it('lança erro se não houver blocos', () => {
    expect(() => iniciarDiagnostico(0)).toThrow()
  })
})

describe('convergência do diagnóstico', () => {
  it('encontra o limite real do aluno (meio de uma faixa grande)', () => {
    const { estadoFinal } = rodarDiagnostico(20, 12)
    expect(estadoFinal.indiceMinimo).toBe(12)
  })

  it('encontra o limite quando o aluno não acerta nada', () => {
    const { estadoFinal } = rodarDiagnostico(20, -1)
    expect(estadoFinal.indiceMinimo).toBe(-1)
  })

  it('encontra o limite quando o aluno acerta tudo', () => {
    const { estadoFinal } = rodarDiagnostico(20, 19)
    expect(estadoFinal.indiceMinimo).toBe(19)
  })

  it('não trava nem gera índice negativo quando o aluno erra até o bloco mais fácil', () => {
    const { estadoFinal, passos } = rodarDiagnostico(20, -1)
    expect(passos).toBeLessThanOrEqual(10)
    expect(estadoFinal.tentativas.every((t) => t.indice >= 0)).toBe(true)
  })

  it('converge rápido mesmo com muitos blocos (a busca em si continua O(log N))', () => {
    const { passos } = rodarDiagnostico(1000, 437)
    expect(passos).toBeLessThanOrEqual(Math.ceil(Math.log2(1000)) + 2)
  })

  it('respeita o mínimo de perguntas mesmo com pouquíssimos blocos', () => {
    // Com só 3 blocos a busca binária pura convergeria em 1-2 perguntas --
    // o mínimo configurado garante mais confirmação antes de concluir.
    const { passos } = rodarDiagnostico(3, 2, 5)
    expect(passos).toBe(5)
  })

  it('funciona com um único bloco disponível, repetindo a confirmação até o mínimo', () => {
    const { estadoFinal, passos } = rodarDiagnostico(1, 0, 5)
    expect(estadoFinal.indiceMinimo).toBe(0)
    expect(passos).toBe(5)
    expect(estadoFinal.tentativas.every((t) => t.indice === 0)).toBe(true)
  })

  it('com mínimo de 1 pergunta, conclui assim que a busca convergir', () => {
    const { passos } = rodarDiagnostico(1, 0, 1)
    expect(passos).toBe(1)
  })
})

describe('calcularIndiceDePartida', () => {
  function estadoComMinimo(indiceMinimo: number): EstadoDiagnostico {
    return { indiceMinimo, indiceMaximo: indiceMinimo, indiceAtual: indiceMinimo, tentativas: [], minimoDePerguntas: 5 }
  }

  it('fica alguns blocos abaixo do limite comprovado, em currículos grandes', () => {
    expect(calcularIndiceDePartida(estadoComMinimo(12), 2)).toBe(10)
  })

  it('nunca fica negativo, mesmo se o aluno não comprovou nada', () => {
    expect(calcularIndiceDePartida(estadoComMinimo(-1), 2)).toBe(0)
  })

  it('REGRESSÃO: em currículo pequeno, não cai sempre no índice 0 mesmo acertando tudo', () => {
    // Bug relatado: com limite comprovado=2 e margem fixa=2, o resultado
    // sempre dava 0, não importa o quanto o aluno acertasse.
    expect(calcularIndiceDePartida(estadoComMinimo(2), 2)).toBeGreaterThan(0)
  })

  it('a margem efetiva nunca passa de metade do limite comprovado', () => {
    expect(calcularIndiceDePartida(estadoComMinimo(1), 2)).toBe(1)
    expect(calcularIndiceDePartida(estadoComMinimo(4), 2)).toBe(2)
  })
})
