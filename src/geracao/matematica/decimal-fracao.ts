import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const decimalFracao: FuncaoGeradora = (rng, parametros) => {
  const direcao = (parametros.direcao as string | undefined) ?? 'fracao-para-decimal'
  const casas = Number(parametros.casas ?? 1)
  const denominador = casas === 2 ? 100 : 10
  const numerador = escolherInteiro(rng, 1, denominador - 1)
  const valorDecimal = numerador / denominador
  const decimalTexto = valorDecimal.toFixed(casas).replace('.', ',')

  if (direcao === 'decimal-para-fracao') {
    return {
      tipo: 'textual',
      enunciado: `Escreva ${decimalTexto} como fração (de ${casas === 2 ? 'centésimos' : 'décimos'}).`,
      dados: { numerador, denominador },
      gabarito: `${numerador}/${denominador}`,
    }
  }

  return {
    tipo: 'numerico',
    enunciado: `Escreva ${numerador}/${denominador} como número decimal.`,
    dados: { numerador, denominador },
    gabarito: valorDecimal,
  }
}
