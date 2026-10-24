import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'
import { simplificarFracao } from './fracoes-util.js'

export const percentualConversao: FuncaoGeradora = (rng, parametros) => {
  const percentuais = (parametros.percentuais as number[] | undefined) ?? [10, 20, 25, 50, 75]
  const direcao = (parametros.direcao as string | undefined) ?? 'percentual-para-fracao'

  const percentual = escolherUm(rng, percentuais)
  const [numerador, denominador] = simplificarFracao(percentual, 100)

  if (direcao === 'fracao-para-percentual') {
    return {
      tipo: 'numerico',
      enunciado: `Escreva a fração ${numerador}/${denominador} como porcentagem (só o número, sem o %).`,
      dados: { numerador, denominador },
      gabarito: percentual,
    }
  }

  return {
    tipo: 'textual',
    enunciado: `Escreva ${percentual}% como fração, na forma mais simples.`,
    dados: { percentual },
    gabarito: `${numerador}/${denominador}`,
  }
}
