import { criarReconhecedorCamada1 } from './camada1-web-speech.js'
import type { IdiomaVoz, ResultadoReconhecimento } from './tipos.js'

export class NenhumaCamadaDisponivelError extends Error {
  constructor() {
    super('Nenhuma camada de reconhecimento de fala está disponível neste aparelho.')
    this.name = 'NenhumaCamadaDisponivelError'
  }
}

/**
 * Tenta as camadas de reconhecimento em ordem, conforme ARQUITETURA.md/[T].
 *
 * Status nesta etapa (Etapa 5 — Motor de Correção):
 *  - Camada 1 (Web Speech API on-device): implementada e funcional.
 *  - Camada 2 (motor ASR offline em WebAssembly, ex. Vosk-browser): AINDA
 *    NÃO implementada. Precisa de uma avaliação dedicada de consumo de
 *    RAM e latência no Redmi 9 antes de entrar em produção — é trabalho
 *    grande o suficiente pra merecer sua própria etapa, não encaixar de
 *    passagem aqui.
 *  - Camada 3 (Web Speech API online, com aviso ao usuário): AINDA NÃO
 *    implementada.
 *
 * Enquanto só a Camada 1 existir: se ela não estiver disponível, esta
 * função lança NenhumaCamadaDisponivelError. A UI deve reagir mostrando a
 * tela "Verificar voz" com o diagnóstico — o item de fala NUNCA é pulado
 * nem trocado por digitação (restrição do briefing).
 */
export async function reconhecerFala(idioma: IdiomaVoz): Promise<ResultadoReconhecimento> {
  const camada1 = criarReconhecedorCamada1()
  if (camada1.disponivel()) {
    return camada1.reconhecer(idioma)
  }

  throw new NenhumaCamadaDisponivelError()
}
