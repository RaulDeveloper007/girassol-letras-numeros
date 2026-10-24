import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

/**
 * Leitura e escrita de números maiores (acima do que dá pra representar
 * contando pontos um a um na tela). Mostra o numeral e pede pra escrevê-lo
 * de novo -- junto com o áudio (lido em voz alta pelo player), reforça
 * reconhecimento e escrita do número.
 */
export const leituraNumero: FuncaoGeradora = (rng, parametros) => {
  const min = Number(parametros.min ?? 11)
  const max = Number(parametros.max ?? 30)
  const numero = escolherInteiro(rng, min, max)

  return {
    tipo: 'numerico',
    enunciado: `Escreva o número: ${numero}`,
    dados: { numero },
    gabarito: numero,
  }
}
