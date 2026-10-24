// Gera um conjunto de treino de dígitos 100% no aparelho, sem nenhum
// download: desenha "0".."9" em várias fontes, tamanhos, pesos e pequenas
// rotações usando a Canvas 2D API. Convenção de cor igual ao MNIST
// clássico: fundo preto (0), traço branco (1) — o pré-processamento do
// desenho da criança (preprocess.js) inverte as cores pra bater com isso.
const FONTS = ['Arial', 'Segoe UI', 'Verdana', 'Georgia', '"Times New Roman"', '"Courier New"', 'sans-serif', 'serif']
const IMAGE_SIZE = 28

function renderDigitSample(rng, digit) {
  const canvas = document.createElement('canvas')
  canvas.width = IMAGE_SIZE
  canvas.height = IMAGE_SIZE
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE)

  const font = FONTS[Math.floor(rng() * FONTS.length)]
  const weight = rng() > 0.5 ? 'bold' : 'normal'
  const size = 16 + Math.floor(rng() * 8) // 16-23px
  const offsetX = (rng() - 0.5) * 4
  const offsetY = (rng() - 0.5) * 4
  const angle = (rng() - 0.5) * 0.35

  ctx.font = `${weight} ${size}px ${font}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.translate(IMAGE_SIZE / 2 + offsetX, IMAGE_SIZE / 2 + offsetY)
  ctx.rotate(angle)
  ctx.fillText(String(digit), 0, 1)
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE)
  const pixels = new Float32Array(IMAGE_SIZE * IMAGE_SIZE)
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = imageData.data[i * 4] / 255
  }
  return pixels
}

export function generateSyntheticDataset(tf, rng, samplesPerDigit = 300, testRatio = 0.1) {
  const allImages = []
  const allLabels = []

  for (let digit = 0; digit <= 9; digit++) {
    for (let s = 0; s < samplesPerDigit; s++) {
      allImages.push(renderDigitSample(rng, digit))
      allLabels.push(digit)
    }
  }

  const indices = allImages.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  const total = indices.length
  const numTest = Math.round(total * testRatio)
  const numTrain = total - numTest
  const imagePixels = IMAGE_SIZE * IMAGE_SIZE

  const trainImagesData = new Float32Array(numTrain * imagePixels)
  const trainLabelsData = new Float32Array(numTrain * 10)
  const testImagesData = new Float32Array(numTest * imagePixels)
  const testLabelsData = new Float32Array(numTest * 10)

  for (let k = 0; k < numTrain; k++) {
    const idx = indices[k]
    trainImagesData.set(allImages[idx], k * imagePixels)
    trainLabelsData[k * 10 + allLabels[idx]] = 1
  }
  for (let k = 0; k < numTest; k++) {
    const idx = indices[numTrain + k]
    testImagesData.set(allImages[idx], k * imagePixels)
    testLabelsData[k * 10 + allLabels[idx]] = 1
  }

  return {
    trainImages: tf.tensor4d(trainImagesData, [numTrain, IMAGE_SIZE, IMAGE_SIZE, 1]),
    trainLabels: tf.tensor2d(trainLabelsData, [numTrain, 10]),
    testImages: tf.tensor4d(testImagesData, [numTest, IMAGE_SIZE, IMAGE_SIZE, 1]),
    testLabels: tf.tensor2d(testLabelsData, [numTest, 10]),
  }
}

export { IMAGE_SIZE }
