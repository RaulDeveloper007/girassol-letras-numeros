import '../styles/big-keyboard.css'

const DIGIT_ROWS = [['1', '2', '3', '4', '5'], ['6', '7', '8', '9', '0']]
const LETTER_ROWS = ['QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), 'ZXCVBNM'.split('')]

export function createBigKeyboard(container, { mode = 'alpha', onSubmit } = {}) {
  const wrapper = document.createElement('div')
  wrapper.className = 'big-keyboard'

  const display = document.createElement('div')
  display.className = 'big-keyboard__display'
  wrapper.appendChild(display)

  const keysArea = document.createElement('div')
  keysArea.className = 'big-keyboard__keys'
  wrapper.appendChild(keysArea)

  let value = ''

  function updateDisplay() {
    display.textContent = value || '…'
  }

  function appendChar(char) {
    value += char
    updateDisplay()
  }

  function backspace() {
    value = value.slice(0, -1)
    updateDisplay()
  }

  function clearValue() {
    value = ''
    updateDisplay()
  }

  function submit() {
    onSubmit?.(value)
  }

  function renderKeys() {
    keysArea.innerHTML = ''
    const rows = mode === 'numeric' ? DIGIT_ROWS : LETTER_ROWS

    rows.forEach((row) => {
      const rowEl = document.createElement('div')
      rowEl.className = 'big-keyboard__row'
      row.forEach((key) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'key'
        btn.textContent = key
        btn.addEventListener('click', () => appendChar(key))
        rowEl.appendChild(btn)
      })
      keysArea.appendChild(rowEl)
    })

    const controlsRow = document.createElement('div')
    controlsRow.className = 'big-keyboard__row'

    const backspaceBtn = document.createElement('button')
    backspaceBtn.type = 'button'
    backspaceBtn.className = 'key key--control'
    backspaceBtn.setAttribute('aria-label', 'Apagar')
    backspaceBtn.textContent = '⌫'
    backspaceBtn.addEventListener('click', backspace)
    controlsRow.appendChild(backspaceBtn)

    const clearBtn = document.createElement('button')
    clearBtn.type = 'button'
    clearBtn.className = 'key key--control'
    clearBtn.textContent = 'Limpar'
    clearBtn.addEventListener('click', clearValue)
    controlsRow.appendChild(clearBtn)

    const submitBtn = document.createElement('button')
    submitBtn.type = 'button'
    submitBtn.className = 'key key--submit'
    submitBtn.textContent = 'Confirmar ✓'
    submitBtn.addEventListener('click', submit)
    controlsRow.appendChild(submitBtn)

    keysArea.appendChild(controlsRow)
  }

  container.appendChild(wrapper)
  renderKeys()
  updateDisplay()

  return {
    getValue: () => value,
    setValue(nextValue) {
      value = nextValue
      updateDisplay()
    },
    destroy() {
      wrapper.remove()
    },
  }
}
