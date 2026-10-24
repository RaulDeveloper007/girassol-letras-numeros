import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const tabuada: FuncaoGeradora = (rng, parametros) => {
  const tabelas = (parametros.tabelas as number[] | undefined) ?? [2, 3, 4, 5]
  const multiplicadorMax = Number(parametros.multiplicadorMax ?? 10)

  const tabela = escolherUm(rng, tabelas)
  const multiplicador = escolherInteiro(rng, 1, multiplicadorMax)

  return {
    tipo: 'numerico',
    enunciado: `${tabela} × ${multiplicador} = ?`,
    dados: { a: tabela, b: multiplicador, operador: '×' },
    gabarito: tabela * multiplicador,
  }
}
