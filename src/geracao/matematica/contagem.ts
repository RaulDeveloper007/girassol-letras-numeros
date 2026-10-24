import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

const SIMBOLOS = ['●', '★', '▲', '■', '♥', '♦'] as const

export const contagem: FuncaoGeradora = (rng, parametros) => {
  const min = Number(parametros.min ?? 1)
  const max = Number(parametros.max ?? 10)
  const exigirNumeral = Boolean(parametros.exigirNumeral)

  const quantidade = escolherInteiro(rng, min, max)
  const simbolo = escolherUm(rng, SIMBOLOS)
  const sequencia = Array(quantidade).fill(simbolo).join(' ')

  return {
    tipo: exigirNumeral ? 'tracado-guiado' : 'numerico',
    enunciado: `Quantos você vê? ${sequencia}`,
    dados: { simbolo, quantidade, exigirNumeral },
    gabarito: quantidade,
  }
}
