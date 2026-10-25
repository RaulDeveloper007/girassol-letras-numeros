import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface TextoComPergunta {
  texto: string
  pergunta: string
  resposta: string
  variantesAceitas?: string[]
}

export const interpretacaoTexto: FuncaoGeradora = (rng, parametros) => {
  const itens = (parametros.itens as TextoComPergunta[] | undefined) ?? []
  const escolhido = escolherUm(rng, itens)

  return {
    tipo: 'textual',
    enunciado: `Leia o texto e responda à pergunta.\n\n${escolhido.texto}\n\nPergunta: ${escolhido.pergunta}`,
    dados: {
      texto: escolhido.texto,
      pergunta: escolhido.pergunta,
      // Não é item de ortografia -- aceita a resposta sem exigir acento
      // perfeito, e aceita variações naturais de como responder.
      regrasTextuais: { normalizarAcentos: true, variantesAceitas: escolhido.variantesAceitas ?? [] },
    },
    gabarito: escolhido.resposta,
  }
}
