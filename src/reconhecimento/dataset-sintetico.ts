// Gera um conjunto de treino 100% no aparelho, sem nenhum download: desenha
// cada caractere do alfabeto (dígitos + , / -) em várias fontes, tamanhos,
// pesos e pequenas rotações usando a Canvas 2D API -- mesma técnica de
// src/recognition/synthetic-digits.js (a da tela antiga), generalizada pro
// alfabeto novo. Convenção de cor igual ao MNIST: fundo preto (0), traço
// branco (1).
import { ALFABETO } from './alfabeto.js'

const FONTES = ['Arial', 'Segoe UI', 'Verdana', 'Georgia', '"Times New Roman"', '"Courier New"', 'sans-serif', 'serif']
const TAMANHO_IMAGEM = 28

function desenharAmostra(rng: () => number, caractere: string): Float32Array {
  const canvas = document.createElement('canvas')
  canvas.width = TAMANHO_IMAGEM
  canvas.height = TAMANHO_IMAGEM
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, TAMANHO_IMAGEM, TAMANHO_IMAGEM)

  const fonte = FONTES[Math.floor(rng() * FONTES.length)]
  const peso = rng() > 0.5 ? 'bold' : 'normal'
  const tamanho = 16 + Math.floor(rng() * 8) // 16-23px
  const deslocamentoX = (rng() - 0.5) * 4
  const deslocamentoY = (rng() - 0.5) * 4
  const angulo = (rng() - 0.5) * 0.35

  ctx.font = `${peso} ${tamanho}px ${fonte}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.translate(TAMANHO_IMAGEM / 2 + deslocamentoX, TAMANHO_IMAGEM / 2 + deslocamentoY)
  ctx.rotate(angulo)
  ctx.fillText(caractere, 0, 1)
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const imageData = ctx.getImageData(0, 0, TAMANHO_IMAGEM, TAMANHO_IMAGEM)
  const pixels = new Float32Array(TAMANHO_IMAGEM * TAMANHO_IMAGEM)
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = imageData.data[i * 4]! / 255
  }
  return pixels
}

export function gerarDatasetSintetico(
  tf: typeof import('@tensorflow/tfjs'),
  rng: () => number,
  amostrasPorCaractere = 300,
  proporcaoTeste = 0.1
) {
  const numeroDeClasses = ALFABETO.length
  const todasAsImagens: Float32Array[] = []
  const todosOsRotulos: number[] = []

  for (let indice = 0; indice < numeroDeClasses; indice++) {
    for (let s = 0; s < amostrasPorCaractere; s++) {
      todasAsImagens.push(desenharAmostra(rng, ALFABETO[indice]!))
      todosOsRotulos.push(indice)
    }
  }

  const indices = todasAsImagens.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j]!, indices[i]!]
  }

  const total = indices.length
  const numeroDeTeste = Math.round(total * proporcaoTeste)
  const numeroDeTreino = total - numeroDeTeste
  const pixelsPorImagem = TAMANHO_IMAGEM * TAMANHO_IMAGEM

  const imagensDeTreino = new Float32Array(numeroDeTreino * pixelsPorImagem)
  const rotulosDeTreino = new Float32Array(numeroDeTreino * numeroDeClasses)
  const imagensDeTeste = new Float32Array(numeroDeTeste * pixelsPorImagem)
  const rotulosDeTeste = new Float32Array(numeroDeTeste * numeroDeClasses)

  for (let k = 0; k < numeroDeTreino; k++) {
    const idx = indices[k]!
    imagensDeTreino.set(todasAsImagens[idx]!, k * pixelsPorImagem)
    rotulosDeTreino[k * numeroDeClasses + todosOsRotulos[idx]!] = 1
  }
  for (let k = 0; k < numeroDeTeste; k++) {
    const idx = indices[numeroDeTreino + k]!
    imagensDeTeste.set(todasAsImagens[idx]!, k * pixelsPorImagem)
    rotulosDeTeste[k * numeroDeClasses + todosOsRotulos[idx]!] = 1
  }

  return {
    imagensDeTreino: tf.tensor4d(imagensDeTreino, [numeroDeTreino, TAMANHO_IMAGEM, TAMANHO_IMAGEM, 1]),
    rotulosDeTreino: tf.tensor2d(rotulosDeTreino, [numeroDeTreino, numeroDeClasses]),
    imagensDeTeste: tf.tensor4d(imagensDeTeste, [numeroDeTeste, TAMANHO_IMAGEM, TAMANHO_IMAGEM, 1]),
    rotulosDeTeste: tf.tensor2d(rotulosDeTeste, [numeroDeTeste, numeroDeClasses]),
  }
}

export { TAMANHO_IMAGEM }
