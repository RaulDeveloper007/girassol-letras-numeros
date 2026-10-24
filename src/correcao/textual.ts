import { distanciaDeEdicao } from './distancia-edicao.js'

export interface RegrasTextuais {
  /** Ignora maiúscula/minúscula. Padrão: true. */
  normalizarCaixa?: boolean
  /** Ignora acentos (NÃO usar em itens de ortografia, onde o acento é o que está sendo testado). Padrão: false. */
  normalizarAcentos?: boolean
  /** Colapsa espaços duplicados e tira espaço nas pontas. Padrão: true. */
  normalizarEspacos?: boolean
  /** Distância de edição máxima ainda aceita como correta. 0 = exato. */
  distanciaMaximaAceita?: number
  /** Outras respostas válidas além do gabarito principal. */
  variantesAceitas?: string[]
}

export interface ResultadoCorrecaoTextual {
  correto: boolean
  distancia: number
  candidatoMaisProximo: string
}

function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function normalizarTexto(texto: string, regras: RegrasTextuais = {}): string {
  let resultado = texto

  if (regras.normalizarEspacos ?? true) {
    resultado = resultado.trim().replace(/\s+/g, ' ')
  }
  if (regras.normalizarCaixa ?? true) {
    resultado = resultado.toLowerCase()
  }
  if (regras.normalizarAcentos ?? false) {
    resultado = removerAcentos(resultado)
  }

  return resultado
}

export function avaliaTextual(
  resposta: string,
  gabarito: string,
  regras: RegrasTextuais = {}
): ResultadoCorrecaoTextual {
  const respostaNormalizada = normalizarTexto(resposta, regras)
  const candidatos = [gabarito, ...(regras.variantesAceitas ?? [])]

  let melhor = { distancia: Infinity, candidato: gabarito }

  for (const candidato of candidatos) {
    const candidatoNormalizado = normalizarTexto(candidato, regras)
    const distancia = distanciaDeEdicao(respostaNormalizada, candidatoNormalizado)
    if (distancia < melhor.distancia) {
      melhor = { distancia, candidato }
    }
  }

  return {
    correto: melhor.distancia <= (regras.distanciaMaximaAceita ?? 0),
    distancia: melhor.distancia,
    candidatoMaisProximo: melhor.candidato,
  }
}
