import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const decimalMultiplicacao: FuncaoGeradora = (rng, parametros) => {
  const casas = Number(parametros.casas ?? 2)
  const escala = 10 ** casas
  const maximoInteiroBase = Number(parametros.maximoInteiroBase ?? 9)
  const modo = (parametros.modo as string | undefined) ?? 'por-inteiro'

  const baseEscalada = escolherInteiro(rng, 1, maximoInteiroBase * escala)
  const baseTexto = (baseEscalada / escala).toFixed(casas).replace('.', ',')

  if (modo === 'por-potencia-de-10') {
    const potencia = escolherUm(rng, [10, 100])
    return {
      tipo: 'numerico',
      enunciado: `${baseTexto} × ${potencia} = ?`,
      dados: { baseEscalada, escala, potencia },
      gabarito: (baseEscalada * potencia) / escala,
    }
  }

  const multiplicador = escolherInteiro(rng, 2, Number(parametros.multiplicadorMax ?? 9))
  const resultadoEscalado = baseEscalada * multiplicador

  return {
    tipo: 'numerico',
    enunciado: `${baseTexto} × ${multiplicador} = ?`,
    dados: { baseEscalada, escala, multiplicador },
    gabarito: resultadoEscalado / escala,
  }
}
