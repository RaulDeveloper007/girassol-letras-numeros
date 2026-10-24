import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const divisao: FuncaoGeradora = (rng, parametros) => {
  const divisores = (parametros.divisores as number[] | undefined) ?? [2, 3, 4, 5]
  const quocienteMax = Number(parametros.quocienteMax ?? 10)
  const comResto = parametros.comResto === undefined ? false : Boolean(parametros.comResto)

  const divisor = escolherUm(rng, divisores)
  const quociente = escolherInteiro(rng, 1, quocienteMax)
  const resto = comResto ? escolherInteiro(rng, 0, divisor - 1) : 0
  const dividendo = divisor * quociente + resto

  const enunciado =
    resto > 0
      ? `${dividendo} ÷ ${divisor} = ? (parte inteira)`
      : `${dividendo} ÷ ${divisor} = ?`

  return {
    tipo: 'numerico',
    enunciado,
    dados: { dividendo, divisor, operador: '÷', resto },
    gabarito: quociente,
  }
}
