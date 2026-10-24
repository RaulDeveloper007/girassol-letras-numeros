const MODEL_URL = 'indexeddb://girassol-digit-model'

export async function loadSavedModel(tf) {
  try {
    return await tf.loadLayersModel(MODEL_URL)
  } catch {
    return null
  }
}

export function saveModel(model) {
  return model.save(MODEL_URL)
}
