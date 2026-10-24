import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const sucessorAntecessor: FuncaoGeradora = (rng, parametros) => {
  const min = Number(parametros.min ?? 1)
  const max = Number(parametros.max ?? 100)
  const tipo = escolherUm(rng, ['sucessor', 'antecessor'])

  if (tipo === 'sucessor') {
    const numero = escolherInteiro(rng, min, max - 1)
    return {
      tipo: 'numerico',
      enunciado: `Qual é o sucessor de ${numero}?`,
      dados: { numero, tipoPergunta: 'sucessor' },
      gabarito: numero + 1,
    }
  }

  const numero = escolherInteiro(rng, min + 1, max)
  return {
    tipo: 'numerico',
    enunciado: `Qual é o antecessor de ${numero}?`,
    dados: { numero, tipoPergunta: 'antecessor' },
    gabarito: numero - 1,
  }
}
