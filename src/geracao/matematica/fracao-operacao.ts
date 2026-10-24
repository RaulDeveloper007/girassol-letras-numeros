import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'
import { simplificarFracao } from './fracoes-util.js'

export const fracaoOperacao: FuncaoGeradora = (rng, parametros) => {
  const denominadores = (parametros.denominadores as number[] | undefined) ?? [2, 3, 4, 5, 6, 8]
  const operacao = (parametros.operacao as string | undefined) ?? 'soma'
  const denominadoresIguais = parametros.denominadoresIguais === undefined ? true : Boolean(parametros.denominadoresIguais)

  let denominadorA = escolherUm(rng, denominadores)
  let numeradorA = escolherInteiro(rng, 1, denominadorA - 1)
  let denominadorB = denominadoresIguais ? denominadorA : escolherUm(rng, denominadores)
  let numeradorB = escolherInteiro(rng, 1, denominadorB - 1)

  // Na subtração, garante que o primeiro termo não seja menor que o
  // segundo, pra nunca cair num resultado negativo.
  if (operacao === 'subtracao' && numeradorA / denominadorA < numeradorB / denominadorB) {
    ;[numeradorA, denominadorA, numeradorB, denominadorB] = [numeradorB, denominadorB, numeradorA, denominadorA]
  }

  let numeradorResultado: number
  let denominadorResultado: number
  let simbolo: string

  if (operacao === 'soma' || operacao === 'subtracao') {
    simbolo = operacao === 'soma' ? '+' : '-'
    denominadorResultado = denominadoresIguais ? denominadorA : denominadorA * denominadorB
    const fatorA = denominadorResultado / denominadorA
    const fatorB = denominadorResultado / denominadorB
    const numA = numeradorA * fatorA
    const numB = numeradorB * fatorB
    numeradorResultado = operacao === 'soma' ? numA + numB : numA - numB
  } else if (operacao === 'multiplicacao') {
    simbolo = '×'
    numeradorResultado = numeradorA * numeradorB
    denominadorResultado = denominadorA * denominadorB
  } else {
    simbolo = '÷'
    numeradorResultado = numeradorA * denominadorB
    denominadorResultado = denominadorA * numeradorB
  }

  const [numeradorFinal, denominadorFinal] = simplificarFracao(numeradorResultado, denominadorResultado)

  return {
    tipo: 'textual',
    enunciado: `${numeradorA}/${denominadorA} ${simbolo} ${numeradorB}/${denominadorB} = ?`,
    dados: { numeradorA, denominadorA, numeradorB, denominadorB, operacao },
    gabarito: `${numeradorFinal}/${denominadorFinal}`,
  }
}
