import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const percentualDeNumero: FuncaoGeradora = (rng, parametros) => {
  const percentuais = (parametros.percentuais as number[] | undefined) ?? [10, 20, 25, 50, 75]
  const baseMax = Number(parametros.baseMax ?? 20)
  const multiploDeBase = Number(parametros.multiploDeBase ?? 20)

  const percentual = escolherUm(rng, percentuais)
  const numero = escolherInteiro(rng, 1, baseMax) * multiploDeBase

  return {
    tipo: 'numerico',
    enunciado: `Quanto é ${percentual}% de ${numero}?`,
    dados: { percentual, numero },
    gabarito: (numero * percentual) / 100,
  }
}
