import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const adicao: FuncaoGeradora = (rng, parametros) => {
  const maxA = Number(parametros.maxA ?? 9)
  const maxB = Number(parametros.maxB ?? 9)
  const comReserva = parametros.comReserva === undefined ? true : Boolean(parametros.comReserva)

  let a = escolherInteiro(rng, 1, maxA)
  let b: number

  if (comReserva) {
    b = escolherInteiro(rng, 1, maxB)
  } else {
    // Sem reserva: o dígito das unidades de a+b não pode passar de 9. Se o
    // dígito de 'a' sozinho já impede qualquer b>=1 válido (ex.: a termina
    // em 9), é 'a' que precisa ser sorteado de novo -- sortear só 'b' de
    // novo nunca resolveria esse caso.
    let tentativas = 0
    let limiteB = Math.min(maxB, 9 - (a % 10))
    while (limiteB < 1 && tentativas < 20) {
      a = escolherInteiro(rng, 1, maxA)
      limiteB = Math.min(maxB, 9 - (a % 10))
      tentativas++
    }
    // Se os limites pedidos não permitirem nenhuma combinação sem reserva
    // (ex.: maxA tão pequeno que força sempre reserva), aceita a reserva
    // em vez de travar.
    b = limiteB >= 1 ? escolherInteiro(rng, 1, limiteB) : escolherInteiro(rng, 1, maxB)
  }

  return {
    tipo: 'numerico',
    enunciado: `${a} + ${b} = ?`,
    dados: { a, b, operador: '+' },
    gabarito: a + b,
  }
}
