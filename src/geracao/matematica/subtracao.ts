import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const subtracao: FuncaoGeradora = (rng, parametros) => {
  const maxA = Number(parametros.maxA ?? 9)
  const maxB = Number(parametros.maxB ?? 9)
  const comEmprestimo = parametros.comEmprestimo === undefined ? true : Boolean(parametros.comEmprestimo)

  let a = escolherInteiro(rng, 2, maxA)
  let b: number

  if (comEmprestimo) {
    b = escolherInteiro(rng, 1, Math.min(maxB, a))
  } else {
    // Sem empréstimo: o dígito das unidades de 'a' precisa ser >= a 'b'
    // (mantemos b <= 9 nos blocos "sem empréstimo", como na adição). Se o
    // dígito de 'a' sozinho já impede qualquer b>=1 válido, sorteia 'a' de
    // novo -- sortear só 'b' de novo nunca resolveria isso.
    let tentativas = 0
    let limiteB = Math.min(maxB, a % 10)
    while (limiteB < 1 && tentativas < 20) {
      a = escolherInteiro(rng, 2, maxA)
      limiteB = Math.min(maxB, a % 10)
      tentativas++
    }
    b = limiteB >= 1 ? escolherInteiro(rng, 1, limiteB) : escolherInteiro(rng, 1, Math.min(maxB, a))
  }

  return {
    tipo: 'numerico',
    enunciado: `${a} - ${b} = ?`,
    dados: { a, b, operador: '-' },
    gabarito: a - b,
  }
}
