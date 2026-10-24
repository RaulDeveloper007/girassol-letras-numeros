// Camada 1: Web Speech API (SpeechRecognition) on-device, quando o
// navegador oferecer. Já validada manualmente na tela #/verificar-voz
// (Etapa 1), nos dois aparelhos.
//
// Tipagem própria e mínima em vez de usar os tipos globais do DOM: a Web
// Speech API não faz parte do lib.dom.d.ts padrão do TypeScript.
import type { IdiomaVoz, ReconhecedorDeFala, ResultadoReconhecimento } from './tipos.js'

interface MotorReconhecimentoNativo {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((evento: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null
  onerror: ((evento: { error: string }) => void) | null
  start: () => void
}

type ConstrutorMotorNativo = new () => MotorReconhecimentoNativo

function obterConstrutor(): ConstrutorMotorNativo | null {
  if (typeof window === 'undefined') return null
  const janela = window as unknown as {
    SpeechRecognition?: ConstrutorMotorNativo
    webkitSpeechRecognition?: ConstrutorMotorNativo
  }
  return janela.SpeechRecognition ?? janela.webkitSpeechRecognition ?? null
}

export function criarReconhecedorCamada1(): ReconhecedorDeFala {
  return {
    disponivel: () => obterConstrutor() !== null,

    reconhecer(idioma: IdiomaVoz) {
      return new Promise<ResultadoReconhecimento>((resolve, reject) => {
        const Construtor = obterConstrutor()
        if (!Construtor) {
          reject(new Error('Reconhecimento de fala (Camada 1) indisponível neste navegador.'))
          return
        }

        const motor = new Construtor()
        motor.lang = idioma
        motor.interimResults = false
        motor.maxAlternatives = 1

        motor.onresult = (evento) => {
          const transcricao = evento.results[0]?.[0]?.transcript ?? ''
          resolve({ transcricao, camada: 1 })
        }
        motor.onerror = (evento) => reject(new Error(`Erro no reconhecimento: ${evento.error}`))

        motor.start()
      })
    },
  }
}
