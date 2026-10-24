import { describe, expect, it } from 'vitest'
import {
  calcularIndiceDePartida,
  diagnosticoConcluido,
  iniciarDiagnostico,
  registrarResposta,
  type EstadoDiagnostico,
} from './algoritmo.js'

/** Simula um aluno cujo limite real é "consegue até este índice, inclusive". */
function rodarDiagnostico(totalBlocos: number, limiteReal: number) {
  let estado = iniciarDiagnostico(totalBlocos)
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
  it('encontra o limite real do aluno (meio da faixa)', () => {
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

  it('converge em poucos passos (O(log N)) mesmo com muitos blocos', () => {
    const { passos } = rodarDiagnostico(1000, 437)
    expect(passos).toBeLessThanOrEqual(Math.ceil(Math.log2(1000)) + 2)
  })

  it('funciona com um único bloco disponível', () => {
    const { estadoFinal, passos } = rodarDiagnostico(1, 0)
    expect(estadoFinal.indiceMinimo).toBe(0)
    expect(passos).toBe(1)
  })
})

describe('calcularIndiceDePartida', () => {
  function estadoComMinimo(indiceMinimo: number): EstadoDiagnostico {
    return { indiceMinimo, indiceMaximo: indiceMinimo, indiceAtual: indiceMinimo, tentativas: [] }
  }

  it('fica alguns blocos abaixo do limite comprovado', () => {
    expect(calcularIndiceDePartida(estadoComMinimo(12), 2)).toBe(10)
  })

  it('nunca fica negativo, mesmo se o aluno não comprovou nada', () => {
    expect(calcularIndiceDePartida(estadoComMinimo(-1), 2)).toBe(0)
  })

  it('nunca fica negativo quando o limite é menor que a margem', () => {
    expect(calcularIndiceDePartida(estadoComMinimo(1), 2)).toBe(0)
  })
})
