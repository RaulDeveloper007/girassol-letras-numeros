const OUTPUT_SIZE = 28

/**
 * Converte o desenho da criança (traço escuro em fundo branco) num tensor
 * 28x28 no mesmo formato do treino (fundo preto = 0, traço branco = 1),
 * recortando e centralizando a tinta como no pré-processamento clássico do
 * MNIST. Retorna null se nada foi desenhado.
 */
export function canvasToDigitTensor(tf, canvasEl) {
  const ctx = canvasEl.getContext('2d')
  const width = canvasEl.width
  const height = canvasEl.height
  const { data } = ctx.getImageData(0, 0, width, height)

  const ink = new Float32Array(width * height)
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const alpha = data[i + 3] / 255
      const luminance = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
      const value = alpha > 0 ? (255 - luminance) / 255 : 0
      ink[y * width + x] = value
      if (value > 0.1) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < minX || maxY < minY) return null

  const boxWidth = maxX - minX + 1
  const boxHeight = maxY - minY + 1
  const size = Math.max(boxWidth, boxHeight) * 1.4

  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = width
  srcCanvas.height = height
  const srcCtx = srcCanvas.getContext('2d')
  const invertedImageData = srcCtx.createImageData(width, height)
  for (let p = 0; p < ink.length; p++) {
    const v = Math.round(ink[p] * 255)
    invertedImageData.data[p * 4] = v
    invertedImageData.data[p * 4 + 1] = v
    invertedImageData.data[p * 4 + 2] = v
    invertedImageData.data[p * 4 + 3] = 255
  }
  srcCtx.putImageData(invertedImageData, 0, 0)

  const outCanvas = document.createElement('canvas')
  outCanvas.width = OUTPUT_SIZE
  outCanvas.height = OUTPUT_SIZE
  const outCtx = outCanvas.getContext('2d')
  outCtx.fillStyle = '#000000'
  outCtx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  outCtx.imageSmoothingEnabled = true

  const scale = OUTPUT_SIZE / size
  const destW = boxWidth * scale
  const destH = boxHeight * scale
  outCtx.drawImage(
    srcCanvas,
    minX,
    minY,
    boxWidth,
    boxHeight,
    (OUTPUT_SIZE - destW) / 2,
    (OUTPUT_SIZE - destH) / 2,
    destW,
    destH
  )

  const finalData = outCtx.getImageData(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  const pixels = new Float32Array(OUTPUT_SIZE * OUTPUT_SIZE)
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = finalData.data[i * 4] / 255
  }

  return tf.tensor4d(pixels, [1, OUTPUT_SIZE, OUTPUT_SIZE, 1])
}
