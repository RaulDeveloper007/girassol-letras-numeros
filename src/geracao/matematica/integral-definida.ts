import { embaralhar, escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'
import { avaliarPolinomio, textoPolinomio, type TermoPolinomio } from './polinomios-util.js'

export const integralDefinida: FuncaoGeradora = (rng, parametros) => {
  const expoentesDisponiveis = (parametros.expoentesDisponiveis as number[] | undefined) ?? [0, 1, 2]
  const quantidadeTermos = Number(parametros.quantidadeTermos ?? 2)
  const multiplicadorMax = Number(parametros.multiplicadorMax ?? 5)
  const limiteSuperiorMax = Number(parametros.limiteSuperiorMax ?? 4)

  const expoentesEscolhidos = embaralhar(rng, expoentesDisponiveis).slice(0, quantidadeTermos)
  // multiplicador × (expoente + 1) garante que, ao integrar (dividir pelo
  // novo expoente), o coeficiente da antiderivada saia sempre inteiro.
  const integrando: TermoPolinomio[] = expoentesEscolhidos.map((expoente) => ({
    coeficiente: escolherInteiro(rng, 1, multiplicadorMax) * (expoente + 1),
    expoente,
  }))

  const antiderivada: TermoPolinomio[] = integrando.map((termo) => ({
    coeficiente: termo.coeficiente / (termo.expoente + 1),
    expoente: termo.expoente + 1,
  }))

  const limiteSuperior = escolherInteiro(rng, 2, limiteSuperiorMax)
  const valor = avaliarPolinomio(antiderivada, limiteSuperior) - avaliarPolinomio(antiderivada, 0)

  return {
    tipo: 'numerico',
    enunciado: `Qual é a integral definida de ${textoPolinomio(integrando)} dx, de 0 a ${limiteSuperior}?`,
    dados: { integrando, limiteSuperior },
    gabarito: valor,
  }
}
