import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface FraseParaCompletar {
  frase: string
  resposta: string
}

// Gerador genérico de "complete a lacuna" -- serve pra qualquer tópico de
// gramática (verbo to be, plural, artigos, tempos verbais) só mudando o
// banco de frases no parametrosGerador, sem precisar de um gerador por
// tópico gramatical.
export const completarFrase: FuncaoGeradora = (rng, parametros) => {
  const frases = (parametros.frases as FraseParaCompletar[] | undefined) ?? []
  const escolhida = escolherUm(rng, frases)

  return {
    tipo: 'textual',
    enunciado: `Complete a frase: ${escolhida.frase}`,
    dados: { frase: escolhida.frase },
    gabarito: escolhida.resposta,
  }
}
