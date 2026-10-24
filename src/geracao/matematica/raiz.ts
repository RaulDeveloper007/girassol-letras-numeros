import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const raiz: FuncaoGeradora = (rng, parametros) => {
  const indices = (parametros.indices as number[] | undefined) ?? [2]
  const raizMax = Number(parametros.raizMax ?? 12)

  const indice = escolherUm(rng, indices)
  const raizValor = escolherInteiro(rng, 2, raizMax)
  const radicando = raizValor ** indice
  const simbolo = indice === 3 ? '∛' : '√'

  return {
    tipo: 'numerico',
    enunciado: `${simbolo}${radicando} = ?`,
    dados: { radicando, indice },
    gabarito: raizValor,
  }
}
