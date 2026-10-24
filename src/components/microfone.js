import '../styles/microfone.css'
import { avaliaTentativaDeFala, decidirAposTentativaDeFala } from '../correcao/fala.js'
import { NenhumaCamadaDisponivelError, reconhecerFala } from '../voz/servico.js'

/**
 * Componente de microfone (E2.7): indicador visual de escuta, transcrição
 * exibida após cada tentativa, até 3 tentativas, encaminha pro orientador
 * se persistir o erro. Nunca pulável -- se a Camada 1 não estiver
 * disponível, avisa e aponta pra tela "Verificar voz" em vez de deixar
 * passar o item sem resposta.
 */
export function criarMicrofone(container, { fraseAlvo, idioma = 'pt-BR', tolerancia, onDecisao }) {
  const wrapper = document.createElement('div')
  wrapper.className = 'microfone'
  wrapper.innerHTML = `
    <button type="button" class="microfone__botao">🎤 Falar</button>
    <p class="microfone__status" aria-live="polite"></p>
    <p class="microfone__transcricao"></p>
  `
  container.appendChild(wrapper)

  const botao = wrapper.querySelector('.microfone__botao')
  const status = wrapper.querySelector('.microfone__status')
  const transcricaoEl = wrapper.querySelector('.microfone__transcricao')

  let numeroDaTentativa = 0

  async function tentar() {
    numeroDaTentativa += 1
    botao.disabled = true
    wrapper.classList.add('microfone--ouvindo')
    status.textContent = '🔴 Ouvindo...'
    transcricaoEl.textContent = ''

    try {
      const resultado = await reconhecerFala(idioma)
      const avaliacao = avaliaTentativaDeFala(resultado.transcricao, fraseAlvo, tolerancia)
      transcricaoEl.textContent = `Você disse: "${resultado.transcricao}"`

      const decisao = decidirAposTentativaDeFala(numeroDaTentativa, avaliacao)

      if (decisao.tipo === 'aceito') {
        status.textContent = '✅ Muito bem!'
      } else if (decisao.tipo === 'tentar-de-novo') {
        status.textContent = `❌ Tente de novo (tentativa ${numeroDaTentativa} de 3).`
        botao.disabled = false
      } else {
        status.textContent = '📨 Enviado para revisão do responsável.'
      }

      onDecisao?.(decisao, avaliacao, resultado)
    } catch (erro) {
      if (erro instanceof NenhumaCamadaDisponivelError) {
        status.textContent = '⚠️ Reconhecimento de fala indisponível neste aparelho. Veja "Verificar voz" no painel do responsável.'
      } else {
        status.textContent = `❌ Erro: ${erro.message}`
        botao.disabled = false
      }
    } finally {
      wrapper.classList.remove('microfone--ouvindo')
    }
  }

  botao.addEventListener('click', tentar)

  return {
    destroy() {
      wrapper.remove()
    },
  }
}
