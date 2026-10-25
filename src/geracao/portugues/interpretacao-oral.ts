import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface TextoComPergunta {
  texto: string
  pergunta: string
  resposta: string
}

export const interpretacaoOral: FuncaoGeradora = (rng, parametros) => {
  const itens = (parametros.itens as TextoComPergunta[] | undefined) ?? []
  const idioma = (parametros.idioma as string | undefined) ?? 'pt-BR'
  const escolhido = escolherUm(rng, itens)

  return {
    tipo: 'fala-resposta',
    enunciado: 'Ouça a história e a pergunta. Depois, responda em voz alta.',
    dados: {
      textoFala: `${escolhido.texto} ${escolhido.pergunta}`,
      fraseAlvo: escolhido.resposta,
      idioma,
    },
    gabarito: escolhido.resposta,
  }
}
