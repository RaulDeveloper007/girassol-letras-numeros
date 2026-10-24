import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const equacaoDoisPassos: FuncaoGeradora = (rng, parametros) => {
  const maxCoeficiente = Number(parametros.maxCoeficiente ?? 9)
  const maxX = Number(parametros.maxX ?? 15)
  const maxConstante = Number(parametros.maxConstante ?? 20)
  const operacao = (parametros.operacao as string | undefined) ?? 'soma'

  const a = escolherInteiro(rng, 2, maxCoeficiente)
  const x = escolherInteiro(rng, 1, maxX)
  const b = escolherInteiro(rng, 1, maxConstante)
  const c = operacao === 'soma' ? a * x + b : a * x - b
  const simbolo = operacao === 'soma' ? '+' : '-'

  return {
    tipo: 'numerico',
    enunciado: `${a}x ${simbolo} ${b} = ${c}. Qual é o valor de x?`,
    dados: { a, b, c, operacao },
    gabarito: x,
  }
}
