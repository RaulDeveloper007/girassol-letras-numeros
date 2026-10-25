import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface PerguntaResposta {
  pergunta: string
  resposta: string
}

export const compreensaoAuditiva: FuncaoGeradora = (rng, parametros) => {
  const perguntas = (parametros.perguntas as PerguntaResposta[] | undefined) ?? []
  const escolhida = escolherUm(rng, perguntas)

  return {
    tipo: 'fala-resposta',
    enunciado: 'Ouça a pergunta e responda em voz alta.',
    dados: { textoFala: escolhida.pergunta, fraseAlvo: escolhida.resposta, idioma: 'pt-BR' },
    gabarito: escolhida.resposta,
  }
}
