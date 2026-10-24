import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const equacaoUmPasso: FuncaoGeradora = (rng, parametros) => {
  const operacao = (parametros.operacao as string | undefined) ?? 'soma'
  const maxX = Number(parametros.maxX ?? 20)
  const maxA = Number(parametros.maxA ?? 10)

  let enunciadoEquacao: string
  let x: number

  if (operacao === 'soma') {
    x = escolherInteiro(rng, 1, maxX)
    const a = escolherInteiro(rng, 1, maxA)
    enunciadoEquacao = `x + ${a} = ${x + a}`
  } else if (operacao === 'subtracao') {
    x = escolherInteiro(rng, 1, maxX)
    const a = escolherInteiro(rng, 1, Math.min(maxA, x))
    enunciadoEquacao = `x - ${a} = ${x - a}`
  } else if (operacao === 'multiplicacao') {
    const a = escolherInteiro(rng, 2, maxA)
    x = escolherInteiro(rng, 1, maxX)
    enunciadoEquacao = `${a}x = ${a * x}`
  } else {
    const a = escolherInteiro(rng, 2, maxA)
    const b = escolherInteiro(rng, 1, maxX)
    x = a * b
    enunciadoEquacao = `x ÷ ${a} = ${b}`
  }

  return {
    tipo: 'numerico',
    enunciado: `${enunciadoEquacao}. Qual é o valor de x?`,
    dados: { operacao },
    gabarito: x,
  }
}
