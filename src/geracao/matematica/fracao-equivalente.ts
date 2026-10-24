import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const fracaoEquivalente: FuncaoGeradora = (rng, parametros) => {
  const denominadoresBase = (parametros.denominadoresBase as number[] | undefined) ?? [2, 3, 4, 5]
  const multiplicadorMax = Number(parametros.multiplicadorMax ?? 4)

  const denominadorBase = escolherUm(rng, denominadoresBase)
  const numeradorBase = escolherInteiro(rng, 1, denominadorBase - 1)
  const multiplicador = escolherInteiro(rng, 2, multiplicadorMax)
  const denominadorAlvo = denominadorBase * multiplicador
  const numeradorAlvo = numeradorBase * multiplicador

  return {
    tipo: 'numerico',
    enunciado: `${numeradorBase}/${denominadorBase} = ?/${denominadorAlvo}`,
    dados: { numeradorBase, denominadorBase, denominadorAlvo },
    gabarito: numeradorAlvo,
  }
}
