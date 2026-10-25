import { salvarConfiguracoesOrientador, obterConfiguracoesOrientador } from '../../dados/orientador.js'
import { hashPin } from '../../app/pin-hash.js'

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function renderPinInput(container, { label, onSubmit }) {
  container.innerHTML = `
    <p>${label}</p>
    <div class="pin-display" id="pin-display"></div>
    <div class="pin-keys" id="pin-keys"></div>
    <p class="pin-error" id="pin-error"></p>
  `

  let value = ''
  const display = container.querySelector('#pin-display')
  const errorEl = container.querySelector('#pin-error')
  const keysEl = container.querySelector('#pin-keys')

  function render() {
    display.textContent = `${'●'.repeat(value.length)}${'·'.repeat(4 - value.length)}`
  }

  function appendDigit(digit) {
    if (value.length >= 4) return
    errorEl.textContent = ''
    value += digit
    render()
    if (value.length === 4) {
      onSubmit(value, {
        reset: () => {
          value = ''
          render()
        },
        showError: (message) => {
          errorEl.textContent = message
        },
      })
    }
  }

  DIGITS.forEach((digit) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'pin-key'
    btn.textContent = digit
    btn.addEventListener('click', () => appendDigit(digit))
    keysEl.appendChild(btn)
  })

  const backspaceBtn = document.createElement('button')
  backspaceBtn.type = 'button'
  backspaceBtn.className = 'pin-key pin-key--control'
  backspaceBtn.setAttribute('aria-label', 'Apagar')
  backspaceBtn.textContent = '⌫'
  backspaceBtn.addEventListener('click', () => {
    value = value.slice(0, -1)
    errorEl.textContent = ''
    render()
  })
  keysEl.appendChild(backspaceBtn)

  render()
}

export function renderPinSetup(container, { onDone }) {
  let firstPin = ''

  function showCreateStep() {
    renderPinInput(container, {
      label: 'Crie um PIN de 4 dígitos para proteger o painel do responsável',
      onSubmit: (pin, { reset }) => {
        firstPin = pin
        reset()
        showConfirmStep()
      },
    })
  }

  function showConfirmStep() {
    renderPinInput(container, {
      label: 'Digite o PIN de novo para confirmar',
      onSubmit: async (pin, { reset, showError }) => {
        if (pin !== firstPin) {
          showError('Os PINs não coincidem. Vamos tentar de novo.')
          reset()
          showCreateStep()
          return
        }
        await salvarConfiguracoesOrientador({ pinHash: hashPin(pin) })
        onDone()
      },
    })
  }

  showCreateStep()

  return () => {}
}

export function renderPinUnlock(container, { onUnlocked }) {
  renderPinInput(container, {
    label: 'Digite o PIN do responsável',
    onSubmit: async (pin, { reset, showError }) => {
      const settings = await obterConfiguracoesOrientador()
      if (hashPin(pin) === settings.pinHash) {
        onUnlocked()
      } else {
        showError('PIN incorreto. Tente de novo.')
        reset()
      }
    },
  })

  return () => {}
}
