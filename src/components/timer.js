export function createTimer(container) {
  const el = document.createElement('span')
  el.className = 'timer'
  container.appendChild(el)

  let seconds = 0
  let intervalId = null

  function render() {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    el.textContent = `⏱ ${m}:${s}`
  }

  function start() {
    render()
    intervalId = window.setInterval(() => {
      seconds += 1
      render()
    }, 1000)
  }

  function stop() {
    if (intervalId !== null) window.clearInterval(intervalId)
    intervalId = null
  }

  start()

  return {
    stop,
    getSeconds: () => seconds,
    destroy() {
      stop()
      el.remove()
    },
  }
}
