import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const percentualProblema: FuncaoGeradora = (rng, parametros) => {
  const percentuais = (parametros.percentuais as number[] | undefined) ?? [10, 20, 25, 50]
  const precoMultiplo = Number(parametros.precoMultiplo ?? 20)
  const precoMax = Number(parametros.precoMax ?? 10)

  const percentual = escolherUm(rng, percentuais)
  const preco = escolherInteiro(rng, 1, precoMax) * precoMultiplo
  const desconto = (preco * percentual) / 100
  const precoFinal = preco - desconto

  return {
    tipo: 'numerico',
    enunciado: `Um produto custa R$ ${preco}. Com ${percentual}% de desconto, quanto você paga?`,
    dados: { preco, percentual, desconto },
    gabarito: precoFinal,
  }
}
