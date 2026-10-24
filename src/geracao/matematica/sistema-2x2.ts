import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const sistema2x2: FuncaoGeradora = (rng, parametros) => {
  const maxValor = Number(parametros.maxValor ?? 10)
  const maxCoeficiente = Number(parametros.maxCoeficiente ?? 5)

  const x = escolherInteiro(rng, 1, maxValor)
  const y = escolherInteiro(rng, 1, maxValor)

  // Precisa de um determinante != 0 pra existir uma única solução de
  // verdade -- senão "qual é o valor de x" não teria resposta única.
  let a1 = 1
  let b1 = 1
  let a2 = 1
  let b2 = 1
  let determinante = 0
  let tentativas = 0
  do {
    a1 = escolherInteiro(rng, 1, maxCoeficiente)
    b1 = escolherInteiro(rng, 1, maxCoeficiente)
    a2 = escolherInteiro(rng, 1, maxCoeficiente)
    b2 = escolherInteiro(rng, 1, maxCoeficiente)
    determinante = a1 * b2 - a2 * b1
    tentativas++
  } while (determinante === 0 && tentativas < 30)

  const c1 = a1 * x + b1 * y
  const c2 = a2 * x + b2 * y
  const pedir = escolherUm(rng, ['x', 'y'])

  return {
    tipo: 'numerico',
    enunciado: `No sistema abaixo, qual é o valor de ${pedir}?\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
    dados: { a1, b1, c1, a2, b2, c2, pedir },
    gabarito: pedir === 'x' ? x : y,
  }
}
