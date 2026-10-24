import { similaridade } from './distancia-edicao.js'
import { normalizarTexto } from './textual.js'

export interface ToleranciaFala {
  /** Similaridade mínima aceita, de 0 a 1. */
  similaridadeMinima: number
}

export interface ResultadoTentativaDeFala {
  aceito: boolean
  similaridade: number
  transcricaoNormalizada: string
}

export function avaliaTentativaDeFala(
  transcricao: string,
  fraseAlvo: string,
  tolerancia: ToleranciaFala
): ResultadoTentativaDeFala {
  const transcricaoNormalizada = normalizarTexto(transcricao, { normalizarAcentos: true })
  const alvoNormalizado = normalizarTexto(fraseAlvo, { normalizarAcentos: true })
  const valorSimilaridade = similaridade(transcricaoNormalizada, alvoNormalizado)

  return {
    aceito: valorSimilaridade >= tolerancia.similaridadeMinima,
    similaridade: valorSimilaridade,
    transcricaoNormalizada,
  }
}

export const MAX_TENTATIVAS_DE_FALA = 3

export type DecisaoAposTentativa =
  | { tipo: 'aceito' }
  | { tipo: 'tentar-de-novo' }
  | { tipo: 'encaminhar-orientador' }

/**
 * Até 3 tentativas por item; persistindo a falha, o item vai para a fila
 * de revisão do orientador (nunca é pulado nem trocado por digitação).
 */
export function decidirAposTentativaDeFala(
  numeroDaTentativa: number,
  resultado: ResultadoTentativaDeFala
): DecisaoAposTentativa {
  if (resultado.aceito) return { tipo: 'aceito' }
  if (numeroDaTentativa >= MAX_TENTATIVAS_DE_FALA) return { tipo: 'encaminhar-orientador' }
  return { tipo: 'tentar-de-novo' }
}

export type EstagioTolerancia = 'inicial' | 'intermediario' | 'avancado'

/** Mais tolerante nos níveis iniciais / vozes infantis, como pede o E2.7. */
export const TOLERANCIA_PADRAO_POR_ESTAGIO: Record<EstagioTolerancia, ToleranciaFala> = {
  inicial: { similaridadeMinima: 0.6 },
  intermediario: { similaridadeMinima: 0.75 },
  avancado: { similaridadeMinima: 0.85 },
}
