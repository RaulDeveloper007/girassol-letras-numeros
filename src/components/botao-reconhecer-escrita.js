import { reconhecerDesenho } from '../reconhecimento/servico.js'

const LIMIAR_BAIXA_CONFIANCA = 0.6

/**
 * Botão "usar o que escrevi": roda o reconhecimento sobre o canvas e
 * preenche o campo de resposta (via onReconhecido) pra o aluno revisar e
 * confirmar -- não envia a resposta direto, só oferece a escrita como uma
 * segunda forma de preencher o mesmo campo que o teclado já preenche.
 * Só cobre o alfabeto de Matemática (dígitos + , / -), ver reconhecimento/alfabeto.ts.
 */
export function criarBotaoReconhecerEscrita(container, { writingCanvas, onReconhecido }) {
  const wrapper = document.createElement('div')
  wrapper.className = 'reconhecer-escrita'

  const botao = document.createElement('button')
  botao.type = 'button'
  botao.className = 'reconhecer-escrita-btn'
  botao.textContent = '🔍 Usar o que escrevi'
  wrapper.appendChild(botao)

  const status = document.createElement('p')
  status.className = 'reconhecer-escrita-status'
  wrapper.appendChild(status)

  container.appendChild(wrapper)

  async function reconhecer() {
    if (!writingCanvas.hasDrawing()) {
      status.textContent = 'Escreva algo no quadro primeiro.'
      return
    }

    botao.disabled = true
    status.textContent = 'Lendo sua escrita…'

    try {
      const resultado = await reconhecerDesenho(writingCanvas.getCanvasElement(), (mensagem) => {
        status.textContent = mensagem
      })

      if (!resultado) {
        status.textContent = 'Não consegui ler nada -- tente escrever de novo.'
        return
      }

      onReconhecido?.(resultado.texto)
      status.textContent =
        resultado.confiancaMinima < LIMIAR_BAIXA_CONFIANCA
          ? `Li "${resultado.texto}", mas não tenho certeza -- confira e corrija se precisar.`
          : `Li "${resultado.texto}". Confira e toque em Confirmar.`
    } catch (erro) {
      status.textContent = `Não consegui ler agora: ${erro.message}`
    } finally {
      botao.disabled = false
    }
  }

  botao.addEventListener('click', reconhecer)

  return {
    destroy() {
      botao.removeEventListener('click', reconhecer)
      wrapper.remove()
    },
  }
}
