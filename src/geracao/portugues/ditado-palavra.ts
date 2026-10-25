import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const ditadoPalavra: FuncaoGeradora = (rng, parametros) => {
  const palavras = (parametros.palavras as string[] | undefined) ?? []
  const idioma = (parametros.idioma as string | undefined) ?? 'pt-BR'
  const palavra = escolherUm(rng, palavras)

  return {
    tipo: 'textual',
    enunciado: 'Ouça com atenção e escreva a palavra certinha (com acento, se tiver).',
    dados: { textoFala: palavra, idioma },
    gabarito: palavra,
  }
}
