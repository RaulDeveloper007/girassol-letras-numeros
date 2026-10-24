import '../styles/cronometro-padrao.css'

/** Cronômetro com cor conforme a proporção do tempo padrão do bloco (E2.4). */
export function criarCronometroPadrao(container, { tempoPadraoSegundos }) {
  const el = document.createElement('span')
  el.className = 'cronometro-padrao'
  container.appendChild(el)

  let segundos = 0
  let intervalId = null

  function corAtual() {
    const proporcao = tempoPadraoSegundos > 0 ? segundos / tempoPadraoSegundos : 0
    if (proporcao < 0.8) return 'verde'
    if (proporcao <= 1) return 'amarelo'
    return 'vermelho'
  }

  function render() {
    const minutos = String(Math.floor(segundos / 60)).padStart(2, '0')
    const segs = String(segundos % 60).padStart(2, '0')
    el.textContent = `⏱ ${minutos}:${segs}`
    el.className = `cronometro-padrao cronometro-padrao--${corAtual()}`
  }

  function iniciar() {
    render()
    intervalId = window.setInterval(() => {
      segundos += 1
      render()
    }, 1000)
  }

  function parar() {
    if (intervalId !== null) window.clearInterval(intervalId)
    intervalId = null
  }

  iniciar()

  return {
    parar,
    getSegundos: () => segundos,
    destroy() {
      parar()
      el.remove()
    },
  }
}
