import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const leituraPalavra: FuncaoGeradora = (rng, parametros) => {
  const palavras = (parametros.palavras as string[] | undefined) ?? []
  const palavra = escolherUm(rng, palavras)

  return {
    tipo: 'fala-leitura',
    enunciado: `Leia a palavra em voz alta: ${palavra}`,
    dados: { fraseAlvo: palavra, idioma: 'pt-BR' },
    gabarito: palavra,
  }
}
