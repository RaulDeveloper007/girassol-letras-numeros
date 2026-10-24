import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const avaliarExpressao: FuncaoGeradora = (rng, parametros) => {
  const forma = (parametros.forma as string | undefined) ?? 'linear'
  const aMax = Number(parametros.aMax ?? 9)
  const bMax = Number(parametros.bMax ?? 9)
  const xMax = Number(parametros.xMax ?? 10)

  const a = escolherInteiro(rng, 2, aMax)
  const b = escolherInteiro(rng, 1, bMax)
  const x = escolherInteiro(rng, 1, xMax)

  if (forma === 'distributiva') {
    return {
      tipo: 'numerico',
      enunciado: `Qual é o valor de ${a}(x + ${b}) quando x = ${x}?`,
      dados: { a, b, x, forma },
      gabarito: a * (x + b),
    }
  }

  return {
    tipo: 'numerico',
    enunciado: `Qual é o valor de ${a}x + ${b} quando x = ${x}?`,
    dados: { a, b, x, forma },
    gabarito: a * x + b,
  }
}
