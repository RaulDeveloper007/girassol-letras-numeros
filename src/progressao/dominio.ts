import type { CriterioDominio, ResultadoFolha } from './tipos.js'

/**
 * "Domínio antes de avançar": só libera o próximo bloco depois de N folhas
 * SEGUIDAS com 100% de acerto na primeira tentativa, dentro do tempo
 * padrão (quando o critério exige isso). Um resultado fraco no meio da
 * sequência reinicia a contagem naturalmente, porque olhamos sempre a
 * janela mais recente.
 */
export function avaliaCriterioDominio(folhasRecentes: ResultadoFolha[], criterio: CriterioDominio): boolean {
  if (folhasRecentes.length < criterio.folhasConsecutivas) return false

  const janela = folhasRecentes.slice(-criterio.folhasConsecutivas)

  return janela.every((folha) => {
    if (folha.notaPrimeiraTentativa !== 100) return false
    if (criterio.dentroDoTempoPadrao && folha.tempoSegundos > folha.tempoPadraoSegundos) return false
    return true
  })
}
