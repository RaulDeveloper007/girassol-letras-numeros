import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const perimetroTriangulo: FuncaoGeradora = (rng, parametros) => {
  const ladoMax = Number(parametros.ladoMax ?? 15)
  const ladoA = escolherInteiro(rng, 2, ladoMax)
  const ladoB = escolherInteiro(rng, 2, ladoMax)

  // A desigualdade triangular (cada lado < soma dos outros dois) precisa
  // valer de verdade -- senão os "lados" sorteados não formam um triângulo.
  const minimoC = Math.max(2, Math.abs(ladoA - ladoB) + 1)
  const maximoC = Math.max(minimoC, Math.min(ladoMax, ladoA + ladoB - 1))
  const ladoC = escolherInteiro(rng, minimoC, maximoC)

  return {
    tipo: 'numerico',
    enunciado: `Um triângulo tem lados de ${ladoA} cm, ${ladoB} cm e ${ladoC} cm. Qual é o perímetro (em cm)?`,
    dados: { ladoA, ladoB, ladoC },
    gabarito: ladoA + ladoB + ladoC,
  }
}
