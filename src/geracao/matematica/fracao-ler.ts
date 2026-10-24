import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const fracaoLer: FuncaoGeradora = (rng, parametros) => {
  const denominadores = (parametros.denominadores as number[] | undefined) ?? [2, 3, 4, 5, 6, 8, 10]
  const denominador = escolherUm(rng, denominadores)
  const numerador = escolherInteiro(rng, 1, denominador - 1)

  return {
    tipo: 'textual',
    enunciado: `Uma figura foi dividida em ${denominador} partes iguais e ${numerador} delas estão pintadas. Que fração representa a parte pintada?`,
    dados: { numerador, denominador },
    gabarito: `${numerador}/${denominador}`,
  }
}
