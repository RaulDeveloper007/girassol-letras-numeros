import { createRng, randomSeed } from '../generators/shared/random.js'

let readyPromise = null

export function isSingleDigitExercise(exercise) {
  return (
    exercise.subject === 'math' &&
    exercise.interaction === 'answer' &&
    typeof exercise.expectedAnswer === 'string' &&
    /^[0-9]$/.test(exercise.expectedAnswer)
  )
}

async function trainNewModel(tf, onProgress) {
  const { generateSyntheticDataset } = await import('./synthetic-digits.js')
  const { buildModel } = await import('./model.js')
  const { saveModel } = await import('./storage.js')

  onProgress?.('Aprendendo os números (só a primeira vez)…')
  const rng = createRng(randomSeed())
  const { trainImages, trainLabels, testImages, testLabels } = generateSyntheticDataset(tf, rng, 300)

  const model = buildModel(tf)
  await model.fit(trainImages, trainLabels, {
    epochs: 8,
    batchSize: 64,
    validationData: [testImages, testLabels],
  })

  await saveModel(model)

  trainImages.dispose()
  trainLabels.dispose()
  testImages.dispose()
  testLabels.dispose()

  return model
}

export function ensureModelReady(onProgress) {
  if (readyPromise) return readyPromise

  readyPromise = (async () => {
    const tf = await import('@tensorflow/tfjs')
    const { loadSavedModel } = await import('./storage.js')

    onProgress?.('Preparando…')
    const existing = await loadSavedModel(tf)
    if (existing) {
      onProgress?.('Pronto!')
      return { tf, model: existing }
    }

    const model = await trainNewModel(tf, onProgress)
    onProgress?.('Pronto!')
    return { tf, model }
  })()

  readyPromise.catch(() => {
    readyPromise = null
  })

  return readyPromise
}

export async function recognizeFromCanvas(canvasEl, onProgress) {
  const { tf, model } = await ensureModelReady(onProgress)
  const { canvasToDigitTensor } = await import('./preprocess.js')

  const inputTensor = canvasToDigitTensor(tf, canvasEl)
  if (!inputTensor) return null

  const prediction = model.predict(inputTensor)
  const probabilities = await prediction.data()
  inputTensor.dispose()
  prediction.dispose()

  let bestDigit = 0
  let bestProb = probabilities[0]
  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > bestProb) {
      bestProb = probabilities[i]
      bestDigit = i
    }
  }

  return { digit: bestDigit, confidence: bestProb }
}
