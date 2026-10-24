import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'
import { simplificarFracao } from './fracoes-util.js'

export const fracaoSimplificar: FuncaoGeradora = (rng, parametros) => {
  const denominadoresBase = (parametros.denominadoresBase as number[] | undefined) ?? [2, 3, 4, 5]
  const multiplicadorMax = Number(parametros.multiplicadorMax ?? 4)

  const denominadorBase = escolherUm(rng, denominadoresBase)
  const numeradorBase = escolherInteiro(rng, 1, denominadorBase - 1)
  const multiplicador = escolherInteiro(rng, 2, multiplicadorMax)

  // Multiplicar numerador e denominador pelo mesmo fator >= 2 garante que a
  // fração sorteada nunca já esteja na forma mais simples.
  const numerador = numeradorBase * multiplicador
  const denominador = denominadorBase * multiplicador
  const [numeradorSimplificado, denominadorSimplificado] = simplificarFracao(numerador, denominador)

  return {
    tipo: 'textual',
    enunciado: `Simplifique a fração ${numerador}/${denominador} até a forma mais simples.`,
    dados: { numerador, denominador },
    gabarito: `${numeradorSimplificado}/${denominadorSimplificado}`,
  }
}
