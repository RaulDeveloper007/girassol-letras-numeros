import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const areaRetangulo: FuncaoGeradora = (rng, parametros) => {
  const ladoMax = Number(parametros.ladoMax ?? 12)
  const base = escolherInteiro(rng, 2, ladoMax)
  const altura = escolherInteiro(rng, 2, ladoMax)

  return {
    tipo: 'numerico',
    enunciado: `Um retângulo tem ${base} cm de base e ${altura} cm de altura. Qual é a área (em cm²)?`,
    dados: { base, altura },
    gabarito: base * altura,
  }
}
