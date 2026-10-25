// Chave de armazenamento própria (diferente de "girassol-digit-model", usado
// pela tela antiga) -- o formato de saída mudou (13 classes, não 10), então
// não pode reaproveitar um modelo salvo com o shape antigo.
const MODEL_URL = 'indexeddb://passo-certo-caracteres-model'

export async function carregarModeloSalvo(tf: typeof import('@tensorflow/tfjs')) {
  try {
    return await tf.loadLayersModel(MODEL_URL)
  } catch {
    return null
  }
}

export function salvarModelo(modelo: import('@tensorflow/tfjs').LayersModel) {
  return modelo.save(MODEL_URL)
}
