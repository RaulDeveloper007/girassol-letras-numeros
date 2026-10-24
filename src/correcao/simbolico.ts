// Correção numérica e simbólica (Matemática). math.js é carregado sob
// demanda (import dinâmico) -- só pesa pra quem está numa fase que
// realmente precisa de álgebra/cálculo, não no carregamento inicial.
import { criarRng } from '../geracao/aleatorio.js'

async function obterMathjs() {
  return import('mathjs')
}

export interface ResultadoCorrecao {
  correto: boolean
  detalhe?: string
}

/**
 * Alunos pt-BR digitam decimais com vírgula ("3,5"). math.js usa vírgula
 * como separador de argumentos, então "3,5" seria lido como dois números --
 * aqui normalizamos só o caso de um número decimal simples (sem isso,
 * qualquer resposta decimal digitada do jeito natural seria rejeitada).
 */
function normalizarVirgulaDecimal(resposta: string): string {
  const texto = resposta.trim()
  return /^-?\d+,\d+$/.test(texto) ? texto.replace(',', '.') : texto
}

export async function avaliaNumerico(resposta: string, gabarito: number, tolerancia = 1e-9): Promise<ResultadoCorrecao> {
  const math = await obterMathjs()
  try {
    const valor = Number(math.evaluate(normalizarVirgulaDecimal(resposta)))
    if (!Number.isFinite(valor)) return { correto: false, detalhe: 'resposta não é um número válido' }
    return { correto: Math.abs(valor - gabarito) <= tolerancia }
  } catch {
    return { correto: false, detalhe: 'não foi possível interpretar a resposta como número/expressão' }
  }
}

/**
 * Compara duas expressões por amostragem numérica: avalia as duas em vários
 * pontos aleatórios das variáveis e aceita como equivalentes se os
 * resultados baterem (dentro de uma tolerância) em todos os pontos onde dá
 * pra avaliar as duas. Mais robusto na prática do que depender só da
 * simplificação simbólica, que nem sempre reduz formas equivalentes.
 */
export async function equivalentesSimbolicamente(
  expressaoA: string,
  expressaoB: string,
  opcoes: { variaveis?: string[]; amostras?: number; tolerancia?: number; semente?: number } = {}
): Promise<boolean> {
  const math = await obterMathjs()
  const variaveis = opcoes.variaveis ?? ['x']
  const amostras = opcoes.amostras ?? 12
  const tolerancia = opcoes.tolerancia ?? 1e-6
  const rng = criarRng(opcoes.semente ?? 20260101)

  let comparacoesValidas = 0

  for (let i = 0; i < amostras; i++) {
    const escopo: Record<string, number> = {}
    for (const variavel of variaveis) {
      // Evita valores "redondos" (0, 1) que escondem erros por coincidência.
      escopo[variavel] = (rng() * 18 - 9) + rng() * 0.137
    }

    let valorA: number
    let valorB: number
    try {
      valorA = Number(math.evaluate(expressaoA, { ...escopo }))
      valorB = Number(math.evaluate(expressaoB, { ...escopo }))
    } catch {
      continue
    }

    if (!Number.isFinite(valorA) || !Number.isFinite(valorB)) continue

    comparacoesValidas++
    if (Math.abs(valorA - valorB) > tolerancia) return false
  }

  return comparacoesValidas > 0
}

export async function avaliaSimbolico(
  resposta: string,
  gabaritoExpressao: string,
  opcoes?: { variaveis?: string[] }
): Promise<ResultadoCorrecao> {
  const equivalente = await equivalentesSimbolicamente(resposta, gabaritoExpressao, opcoes)
  return equivalente
    ? { correto: true, detalhe: 'forma equivalente aceita' }
    : { correto: false }
}

/**
 * Integral indefinida: em vez de comparar a resposta literal do aluno com
 * um gabarito fixo, deriva a resposta e compara com o integrando original.
 * Isso aceita automaticamente qualquer constante "+C" (a derivada de uma
 * constante é zero) e qualquer forma algebricamente equivalente.
 */
export async function avaliaIntegralIndefinida(
  resposta: string,
  integrando: string,
  variavel = 'x'
): Promise<ResultadoCorrecao> {
  const math = await obterMathjs()

  let derivadaDaResposta: string
  try {
    derivadaDaResposta = math.derivative(resposta, variavel).toString()
  } catch {
    return { correto: false, detalhe: 'não foi possível derivar a resposta (expressão inválida?)' }
  }

  const equivalente = await equivalentesSimbolicamente(derivadaDaResposta, integrando, { variaveis: [variavel] })
  return equivalente
    ? { correto: true, detalhe: 'derivada da resposta bate com o integrando (constante aceita)' }
    : { correto: false }
}
