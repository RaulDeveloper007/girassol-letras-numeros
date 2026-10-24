import '../styles/player-audio.css'

/** Player de voz com controle de velocidade (E2.6). */
export function criarPlayerAudio(container, { texto, idioma = 'pt-BR', velocidadeInicial = 1 }) {
  const wrapper = document.createElement('div')
  wrapper.className = 'player-audio'
  wrapper.innerHTML = `
    <button type="button" class="player-audio__tocar">🔊 Ouvir</button>
    <label class="player-audio__velocidade">
      Velocidade
      <input type="range" min="0.6" max="1.4" step="0.1" value="${velocidadeInicial}" />
      <span class="player-audio__valor">${velocidadeInicial.toFixed(1)}x</span>
    </label>
  `
  container.appendChild(wrapper)

  const botao = wrapper.querySelector('.player-audio__tocar')
  const slider = wrapper.querySelector('input[type="range"]')
  const valorEl = wrapper.querySelector('.player-audio__valor')
  let velocidade = velocidadeInicial

  slider.addEventListener('input', () => {
    velocidade = Number(slider.value)
    valorEl.textContent = `${velocidade.toFixed(1)}x`
  })

  botao.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = idioma
    utterance.rate = velocidade
    window.speechSynthesis.speak(utterance)
  })

  return {
    destroy() {
      window.speechSynthesis?.cancel()
      wrapper.remove()
    },
  }
}
