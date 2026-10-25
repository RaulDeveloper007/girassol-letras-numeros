// Chave de armazenamento própria (diferente de "girassol-digit-model", usado
// pela tela antiga) -- o formato de saída mudou (13 classes, não 10), então
// não pode reaproveitar um modelo salvo com o shape antigo.
// v2: dataset sintético passou a simular traço grosso/borrado (ver
// dataset-sintetico.ts) -- muda o resultado do treino, então precisa de
// uma chave nova pra quem já tinha um modelo v1 salvo treinar de novo em
// vez de continuar usando o antigo (menos preciso) para sempre.
const MODEL_URL = 'indexeddb://passo-certo-caracteres-model-v2'

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
