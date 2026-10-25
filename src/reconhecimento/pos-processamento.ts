// Transformações aplicadas às amostras sintéticas de treino (fonte
// renderizada em 28x28) pra aproximar mais a "textura" de um traço real --
// mais grosso e com borda suave -- do que a borda limpa e fina de uma
// fonte. Sem isso, o modelo aprende a reconhecer letras de fonte, não
// escrita à mão real (risco já registrado no plano de reconhecimento).
export function dilatar(pixels: Float32Array, tamanho: number, raio: number): Float32Array {
  if (raio <= 0) return pixels

  const saida = new Float32Array(pixels.length)
  for (let y = 0; y < tamanho; y++) {
    for (let x = 0; x < tamanho; x++) {
      let maior = 0
      for (let dy = -raio; dy <= raio; dy++) {
        for (let dx = -raio; dx <= raio; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= tamanho || ny >= tamanho) continue
          const valor = pixels[ny * tamanho + nx]!
          if (valor > maior) maior = valor
        }
      }
      saida[y * tamanho + x] = maior
    }
  }
  return saida
}

export function borrar(pixels: Float32Array, tamanho: number, passes = 1): Float32Array {
  let atual = pixels
  for (let p = 0; p < passes; p++) {
    const saida = new Float32Array(atual.length)
    for (let y = 0; y < tamanho; y++) {
      for (let x = 0; x < tamanho; x++) {
        let soma = 0
        let n = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || ny < 0 || nx >= tamanho || ny >= tamanho) continue
            soma += atual[ny * tamanho + nx]!
            n++
          }
        }
        saida[y * tamanho + x] = soma / n
      }
    }
    atual = saida
  }
  return atual
}
