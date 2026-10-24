import '../styles/writing-canvas.css'

const MIN_STROKE_WIDTH = 4
// Rejeição de palma: enquanto a caneta estiver em uso (ou tiver sido usada
// há pouco), ignora toques -- evita que a mão apoiada na tela vire traço.
const JANELA_REJEICAO_PALMA_MS = 700

export function createWritingCanvas(container, options = {}) {
  const {
    strokeColor = '#4e342e',
    strokeWidth = 6,
    eraserWidth = 28,
  } = options

  const wrapper = document.createElement('div')
  wrapper.className = 'writing-canvas'

  const canvas = document.createElement('canvas')
  canvas.className = 'writing-canvas__surface'
  wrapper.appendChild(canvas)

  const toolbar = document.createElement('div')
  toolbar.className = 'writing-canvas__toolbar'
  toolbar.innerHTML = `
    <button type="button" data-action="pen" class="is-active" aria-label="Lápis">✏️</button>
    <button type="button" data-action="eraser" aria-label="Borracha">🧽</button>
    <button type="button" data-action="undo" aria-label="Desfazer">↩️</button>
    <button type="button" data-action="clear" aria-label="Limpar tudo">🗑️</button>
  `
  wrapper.appendChild(toolbar)
  container.appendChild(wrapper)

  const ctx = canvas.getContext('2d')
  let strokes = []
  let currentStroke = null
  let mode = 'pen'
  let activePointerId = null
  let cssWidth = 0
  let cssHeight = 0
  let ultimaCanetaEm = 0

  function toPixel(point) {
    return { x: point.x * cssWidth, y: point.y * cssHeight }
  }

  function applyStrokeStyle(stroke) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (stroke.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = stroke.width
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
    }
  }

  function drawSegment(stroke, fromPoint, toPoint) {
    const from = toPixel(fromPoint)
    const to = toPixel(toPoint)
    ctx.save()
    applyStrokeStyle(stroke)
    ctx.lineWidth = stroke.width * (0.6 + toPoint.pressure * 0.4)
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
  }

  function drawDot(stroke, point) {
    const p = toPixel(point)
    ctx.save()
    applyStrokeStyle(stroke)
    const radius = (stroke.width * (0.6 + point.pressure * 0.4)) / 2
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(radius, MIN_STROKE_WIDTH / 2), 0, Math.PI * 2)
    ctx.fillStyle = stroke.type === 'eraser' ? '#000000' : stroke.color
    ctx.fill()
    ctx.restore()
  }

  function redrawAll() {
    ctx.clearRect(0, 0, cssWidth, cssHeight)
    for (const stroke of strokes) {
      if (stroke.points.length === 1) {
        drawDot(stroke, stroke.points[0])
        continue
      }
      for (let i = 1; i < stroke.points.length; i++) {
        drawSegment(stroke, stroke.points[i - 1], stroke.points[i])
      }
    }
  }

  function resize() {
    // O tamanho do canvas na tela é definido só pelo CSS (não por conta
    // daqui). Medir o próprio canvas, em vez do wrapper (que inclui o
    // canvas + a barra de ferramentas), evita um laço de realimentação:
    // se escrevêssemos de volta uma altura derivada do wrapper, o canvas
    // cresceria, o wrapper cresceria com ele, e o observer disparava de
    // novo — crescendo sem fim.
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    cssWidth = rect.width
    cssHeight = rect.height
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(cssWidth * dpr)
    canvas.height = Math.round(cssHeight * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    redrawAll()
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      pressure: event.pressure > 0 ? event.pressure : 0.5,
    }
  }

  function setMode(nextMode) {
    mode = nextMode
    toolbar.querySelectorAll('button[data-action="pen"], button[data-action="eraser"]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.action === mode)
    })
  }

  function undo() {
    strokes.pop()
    redrawAll()
  }

  function clear() {
    strokes = []
    redrawAll()
  }

  function hasDrawing() {
    return strokes.some((stroke) => stroke.type === 'pen')
  }

  function handlePointerDown(event) {
    if (activePointerId !== null) return

    if (event.pointerType === 'pen') {
      ultimaCanetaEm = Date.now()
    } else if (event.pointerType === 'touch' && Date.now() - ultimaCanetaEm < JANELA_REJEICAO_PALMA_MS) {
      // Toque logo depois (ou durante) o uso da caneta: provavelmente a
      // palma da mão apoiada na tela, não uma intenção de desenhar.
      return
    }

    activePointerId = event.pointerId
    canvas.setPointerCapture(event.pointerId)
    const point = pointFromEvent(event)
    currentStroke = {
      type: mode,
      color: strokeColor,
      width: mode === 'eraser' ? eraserWidth : strokeWidth,
      points: [point],
    }
    event.preventDefault()
  }

  function handlePointerMove(event) {
    if (event.pointerId !== activePointerId || !currentStroke) return
    if (event.pointerType === 'pen') ultimaCanetaEm = Date.now()
    const point = pointFromEvent(event)
    const lastPoint = currentStroke.points[currentStroke.points.length - 1]
    currentStroke.points.push(point)
    drawSegment(currentStroke, lastPoint, point)
    event.preventDefault()
  }

  function endStroke(event) {
    if (event.pointerId !== activePointerId) return
    if (currentStroke) {
      if (currentStroke.points.length === 1) {
        drawDot(currentStroke, currentStroke.points[0])
      }
      strokes.push(currentStroke)
      currentStroke = null
    }
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }
    activePointerId = null
  }

  function handlePointerLeave(event) {
    if (event.pointerType === 'mouse') endStroke(event)
  }

  function handleToolbarClick(event) {
    const action = event.target.closest('button')?.dataset.action
    if (!action) return
    if (action === 'pen' || action === 'eraser') setMode(action)
    if (action === 'undo') undo()
    if (action === 'clear') clear()
  }

  canvas.addEventListener('pointerdown', handlePointerDown)
  canvas.addEventListener('pointermove', handlePointerMove)
  canvas.addEventListener('pointerup', endStroke)
  canvas.addEventListener('pointercancel', endStroke)
  canvas.addEventListener('pointerleave', handlePointerLeave)
  toolbar.addEventListener('click', handleToolbarClick)

  const resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(wrapper)

  resize()

  return {
    clear,
    undo,
    setMode,
    hasDrawing,
    getCanvasElement: () => canvas,
    destroy() {
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', endStroke)
      canvas.removeEventListener('pointercancel', endStroke)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      toolbar.removeEventListener('click', handleToolbarClick)
      wrapper.remove()
    },
  }
}
