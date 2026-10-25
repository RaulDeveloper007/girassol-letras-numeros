import type { CriterioDominio, ResultadoFolha } from './tipos.js'

// O cronômetro mede o tempo de parede da folha inteira (inclui ler o
// enunciado, pensar, trocar de ferramenta de resposta) -- cobrar o tempo
// padrão sem nenhuma folga faz até um aluno que acerta tudo falhar o
// critério por alguns segundos. ARQUITETURA.md já previa uma tolerância
// (RegraDeAvanco.toleranciaTempoPadrao) que nunca chegou a ser ligada ao
// motor; aqui fica um valor fixo razoável até existir essa configuração.
const TOLERANCIA_TEMPO_PADRAO = 1.2

function folhaDentroDoCriterio(folha: ResultadoFolha, criterio: CriterioDominio): boolean {
  if (folha.notaPrimeiraTentativa !== 100) return false
  if (criterio.dentroDoTempoPadrao && folha.tempoSegundos > folha.tempoPadraoSegundos * TOLERANCIA_TEMPO_PADRAO) return false
  return true
}

/**
 * "Domínio antes de avançar": só libera o próximo bloco depois de N folhas
 * SEGUIDAS com 100% de acerto na primeira tentativa, dentro do tempo
 * padrão -- com folga (ver TOLERANCIA_TEMPO_PADRAO) -- quando o critério
 * exige isso. Um resultado fraco no meio da sequência reinicia a contagem
 * naturalmente, porque olhamos sempre a janela mais recente.
 */
export function avaliaCriterioDominio(folhasRecentes: ResultadoFolha[], criterio: CriterioDominio): boolean {
  if (folhasRecentes.length < criterio.folhasConsecutivas) return false

  const janela = folhasRecentes.slice(-criterio.folhasConsecutivas)
  return janela.every((folha) => folhaDentroDoCriterio(folha, criterio))
}

/**
 * Quantas folhas seguidas (contando de trás pra frente a partir da mais
 * recente) já estão dentro do critério de domínio agora -- usado só pra
 * mostrar ao aluno/responsável o quão perto do avanço automático ele está
 * (ex.: "2 de 3"), não pra decidir o avanço em si (isso é
 * avaliaCriterioDominio).
 */
export function contarSequenciaAtual(folhasRecentes: ResultadoFolha[], criterio: CriterioDominio): number {
  let contagem = 0
  for (let i = folhasRecentes.length - 1; i >= 0; i--) {
    if (!folhaDentroDoCriterio(folhasRecentes[i]!, criterio)) break
    contagem++
  }
  return Math.min(contagem, criterio.folhasConsecutivas)
}
