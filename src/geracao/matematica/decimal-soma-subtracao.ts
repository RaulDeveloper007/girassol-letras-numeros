import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const decimalSomaSubtracao: FuncaoGeradora = (rng, parametros) => {
  const casas = Number(parametros.casas ?? 1)
  const escala = 10 ** casas
  const maximoInteiro = Number(parametros.maximoInteiro ?? 9)
  const operacao = (parametros.operacao as string | undefined) ?? 'soma'

  let a = escolherInteiro(rng, 1, maximoInteiro * escala)
  let b = escolherInteiro(rng, 1, maximoInteiro * escala)

  // Opera tudo em "escala" (inteiros) pra não acumular erro de ponto
  // flutuante, e só divide por escala no fim. Na subtração, garante que o
  // primeiro termo não seja menor que o segundo.
  if (operacao === 'subtracao' && a < b) {
    ;[a, b] = [b, a]
  }

  const resultadoEscalado = operacao === 'soma' ? a + b : a - b
  const simbolo = operacao === 'soma' ? '+' : '-'
  const formatar = (valorEscalado: number) => (valorEscalado / escala).toFixed(casas).replace('.', ',')

  return {
    tipo: 'numerico',
    enunciado: `${formatar(a)} ${simbolo} ${formatar(b)} = ?`,
    dados: { a, b, escala, operacao },
    gabarito: resultadoEscalado / escala,
  }
}
