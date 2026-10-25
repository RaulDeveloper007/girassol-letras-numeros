import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

interface FraseParaCorrigir {
  errada: string
  correta: string
}

export const pontuacaoCorrigir: FuncaoGeradora = (rng, parametros) => {
  const frases = (parametros.frases as FraseParaCorrigir[] | undefined) ?? []
  const escolhida = escolherUm(rng, frases)

  return {
    tipo: 'textual',
    enunciado: `Reescreva a frase com a pontuação e as maiúsculas corretas: ${escolhida.errada}`,
    // A correção por padrão ignora maiúscula/minúscula -- aqui é
    // exatamente isso que está sendo testado, então desligamos.
    dados: { errada: escolhida.errada, regrasTextuais: { normalizarCaixa: false } },
    gabarito: escolhida.correta,
  }
}
