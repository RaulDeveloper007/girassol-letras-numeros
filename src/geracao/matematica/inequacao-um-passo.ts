import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const inequacaoUmPasso: FuncaoGeradora = (rng, parametros) => {
  const maxX = Number(parametros.maxX ?? 15)
  const maxA = Number(parametros.maxA ?? 10)
  const operadores = (parametros.operadores as string[] | undefined) ?? ['>', '<', '≥', '≤']

  const operador = escolherUm(rng, operadores)
  const a = escolherInteiro(rng, 1, maxA)
  const limite = escolherInteiro(rng, a + 1, maxX + a)
  const fronteira = limite - a // x + a OPERADOR limite  <=>  x OPERADOR fronteira

  let gabarito: number
  let pergunta: string
  if (operador === '>') {
    gabarito = fronteira + 1
    pergunta = 'menor número inteiro que satisfaz'
  } else if (operador === '≥') {
    gabarito = fronteira
    pergunta = 'menor número inteiro que satisfaz'
  } else if (operador === '<') {
    gabarito = fronteira - 1
    pergunta = 'maior número inteiro que satisfaz'
  } else {
    gabarito = fronteira
    pergunta = 'maior número inteiro que satisfaz'
  }

  return {
    tipo: 'numerico',
    enunciado: `x + ${a} ${operador} ${limite}. Qual é o ${pergunta} essa inequação?`,
    dados: { a, limite, operador },
    gabarito,
  }
}
