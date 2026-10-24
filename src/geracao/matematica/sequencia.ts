import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const sequencia: FuncaoGeradora = (rng, parametros) => {
  const maxInicio = Number(parametros.maxInicio ?? 20)
  const passos = (parametros.passos as number[] | undefined) ?? [1]
  const tamanho = Number(parametros.tamanho ?? 5)

  const passo = escolherUm(rng, passos)
  const inicio = escolherInteiro(rng, 1, maxInicio)
  const numeros = Array.from({ length: tamanho }, (_, i) => inicio + passo * i)

  const indiceOculto = escolherInteiro(rng, Math.min(2, tamanho - 1), tamanho - 1)
  const resposta = numeros[indiceOculto]!
  const exibicao = numeros.map((numero, i) => (i === indiceOculto ? '❓' : String(numero))).join(', ')

  return {
    tipo: 'numerico',
    enunciado: `Qual número completa a sequência? ${exibicao}`,
    dados: { numeros, indiceOculto, passo },
    gabarito: resposta,
  }
}
