import { embaralhar, escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'
import { avaliarPolinomio, derivarPolinomio, textoPolinomio, type TermoPolinomio } from './polinomios-util.js'

export const derivadaEmPonto: FuncaoGeradora = (rng, parametros) => {
  const expoentesDisponiveis = (parametros.expoentesDisponiveis as number[] | undefined) ?? [1, 2, 3]
  const quantidadeTermos = Number(parametros.quantidadeTermos ?? 2)
  const coeficienteMax = Number(parametros.coeficienteMax ?? 6)
  const pontoMax = Number(parametros.pontoMax ?? 5)

  const expoentesEscolhidos = embaralhar(rng, expoentesDisponiveis).slice(0, quantidadeTermos)
  const termos: TermoPolinomio[] = expoentesEscolhidos.map((expoente) => ({
    coeficiente: escolherInteiro(rng, 1, coeficienteMax),
    expoente,
  }))

  const derivada = derivarPolinomio(termos)
  const x0 = escolherInteiro(rng, 1, pontoMax)
  const valor = avaliarPolinomio(derivada, x0)

  return {
    tipo: 'numerico',
    enunciado: `Se f(x) = ${textoPolinomio(termos)}, qual é f'(${x0}) (a derivada de f no ponto x = ${x0})?`,
    dados: { termos, x0 },
    gabarito: valor,
  }
}
