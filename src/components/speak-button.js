export function createSpeakButton({ text, lang = 'pt-BR' }) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'speak-button'
  button.setAttribute('aria-label', 'Ouvir')
  button.textContent = '🔊'

  button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
  })

  return button
}
