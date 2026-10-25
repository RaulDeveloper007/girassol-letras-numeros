// Lê o desenho de um <canvas> (traço escuro em fundo claro) e converte pra
// uma grade de "intensidade de tinta" 0..1 por pixel -- mesma convenção
// usada no treino sintético (fundo preto = 0, traço branco = 1).
export function extrairTintaDoCanvas(canvasEl: HTMLCanvasElement): { tinta: Float32Array; largura: number; altura: number } {
  const ctx = canvasEl.getContext('2d')!
  const largura = canvasEl.width
  const altura = canvasEl.height
  const { data } = ctx.getImageData(0, 0, largura, altura)

  const tinta = new Float32Array(largura * altura)
  for (let i = 0; i < largura * altura; i++) {
    const alpha = data[i * 4 + 3]! / 255
    const luminancia = data[i * 4]! * 0.3 + data[i * 4 + 1]! * 0.59 + data[i * 4 + 2]! * 0.11
    tinta[i] = alpha > 0 ? (255 - luminancia) / 255 : 0
  }

  return { tinta, largura, altura }
}
