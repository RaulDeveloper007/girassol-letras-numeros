// Mesma arquitetura pequena do classificador de dígitos original
// (src/recognition/model.js), só generalizada pro número de classes do
// alfabeto novo (dígitos + vírgula/barra/menos).
export function construirModelo(tf: typeof import('@tensorflow/tfjs'), numeroDeClasses: number) {
  const modelo = tf.sequential()

  modelo.add(tf.layers.conv2d({ inputShape: [28, 28, 1], kernelSize: 3, filters: 8, activation: 'relu' }))
  modelo.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  modelo.add(tf.layers.conv2d({ kernelSize: 3, filters: 16, activation: 'relu' }))
  modelo.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  modelo.add(tf.layers.flatten())
  modelo.add(tf.layers.dense({ units: 32, activation: 'relu' }))
  modelo.add(tf.layers.dense({ units: numeroDeClasses, activation: 'softmax' }))

  modelo.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  return modelo
}
