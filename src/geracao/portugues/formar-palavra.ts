import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface PalavraComSilabas {
  silabas: string[]
  palavra: string
}

export const formarPalavra: FuncaoGeradora = (rng, parametros) => {
  const palavras = (parametros.palavras as PalavraComSilabas[] | undefined) ?? []
  const escolhida = escolherUm(rng, palavras)

  return {
    tipo: 'textual',
    enunciado: `Junte as sílabas e escreva a palavra: ${escolhida.silabas.join(' - ')}`,
    dados: { silabas: escolhida.silabas },
    gabarito: escolhida.palavra,
  }
}
