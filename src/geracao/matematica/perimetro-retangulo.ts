import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const perimetroRetangulo: FuncaoGeradora = (rng, parametros) => {
  const ladoMax = Number(parametros.ladoMax ?? 15)
  const base = escolherInteiro(rng, 2, ladoMax)
  const altura = escolherInteiro(rng, 2, ladoMax)

  return {
    tipo: 'numerico',
    enunciado: `Um retângulo tem ${base} cm de base e ${altura} cm de altura. Qual é o perímetro (em cm)?`,
    dados: { base, altura },
    gabarito: 2 * (base + altura),
  }
}
