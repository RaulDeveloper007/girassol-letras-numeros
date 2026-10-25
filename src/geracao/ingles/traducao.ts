import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface ParDeTraducao {
  portugues: string
  ingles: string
  variantesAceitas?: string[]
}

export const traducao: FuncaoGeradora = (rng, parametros) => {
  const pares = (parametros.pares as ParDeTraducao[] | undefined) ?? []
  const escolhido = escolherUm(rng, pares)

  return {
    tipo: 'textual',
    enunciado: `Como se diz "${escolhido.portugues}" em inglês?`,
    dados: { portugues: escolhido.portugues, regrasTextuais: { variantesAceitas: escolhido.variantesAceitas ?? [] } },
    gabarito: escolhido.ingles,
  }
}
