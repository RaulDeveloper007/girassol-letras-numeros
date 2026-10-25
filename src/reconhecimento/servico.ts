// Ponto de entrada do motor de reconhecimento: treina/carrega o modelo,
// segmenta o desenho em caracteres e devolve o texto reconhecido (ex. "17",
// "0,7", "3/4"). Cobre só o alfabeto de Matemática (dígitos + , / -) --
// ver ALFABETO em alfabeto.ts e a discussão de escopo no PR.
import { ALFABETO, caractereDoIndice } from './alfabeto.js'
import { carregarModeloSalvo, salvarModelo } from './armazenamento.js'
import { gerarDatasetSintetico } from './dataset-sintetico.js'
import { extrairTintaDoCanvas } from './extrair-tinta.js'
import { construirModelo } from './modelo.js'
import { recortarEEscalar } from './recorte.js'
import { segmentarEmCaracteres } from './segmentacao.js'
import { criarRng, semeadorAleatorio } from '../geracao/aleatorio.js'

type Tf = typeof import('@tensorflow/tfjs')
type Modelo = import('@tensorflow/tfjs').LayersModel

let promessaPronta: Promise<{ tf: Tf; modelo: Modelo }> | null = null

async function treinarNovoModelo(tf: Tf, aoProgredir?: (mensagem: string) => void): Promise<Modelo> {
  aoProgredir?.('Aprendendo os números e símbolos (só a primeira vez)…')
  const rng = criarRng(semeadorAleatorio())
  const { imagensDeTreino, rotulosDeTreino, imagensDeTeste, rotulosDeTeste } = gerarDatasetSintetico(tf, rng, 300)

  const modelo = construirModelo(tf, ALFABETO.length)
  await modelo.fit(imagensDeTreino, rotulosDeTreino, {
    epochs: 8,
    batchSize: 64,
    validationData: [imagensDeTeste, rotulosDeTeste],
  })

  await salvarModelo(modelo)

  imagensDeTreino.dispose()
  rotulosDeTreino.dispose()
  imagensDeTeste.dispose()
  rotulosDeTeste.dispose()

  return modelo
}

export function garantirModeloPronto(aoProgredir?: (mensagem: string) => void): Promise<{ tf: Tf; modelo: Modelo }> {
  if (promessaPronta) return promessaPronta

  promessaPronta = (async () => {
    const tf = await import('@tensorflow/tfjs')

    aoProgredir?.('Preparando…')
    const modeloExistente = await carregarModeloSalvo(tf)
    if (modeloExistente) {
      aoProgredir?.('Pronto!')
      return { tf, modelo: modeloExistente }
    }

    const modelo = await treinarNovoModelo(tf, aoProgredir)
    aoProgredir?.('Pronto!')
    return { tf, modelo }
  })()

  promessaPronta.catch(() => {
    promessaPronta = null
  })

  return promessaPronta
}

export interface ResultadoReconhecimento {
  texto: string
  confiancaMinima: number
}

/**
 * Reconhece o conteúdo de um canvas de escrita como uma sequência de
 * caracteres (ex. "17", "0,7", "3/4"). Retorna null se o canvas estiver em
 * branco. confiancaMinima é a menor confiança entre os caracteres
 * reconhecidos -- útil pra avisar o aluno quando a leitura foi incerta.
 */
export async function reconhecerDesenho(
  canvasEl: HTMLCanvasElement,
  aoProgredir?: (mensagem: string) => void
): Promise<ResultadoReconhecimento | null> {
  const { tf, modelo } = await garantirModeloPronto(aoProgredir)
  const { tinta, largura, altura } = extrairTintaDoCanvas(canvasEl)
  const caixas = segmentarEmCaracteres(tinta, largura, altura)
  if (caixas.length === 0) return null

  let texto = ''
  let confiancaMinima = 1

  for (const caixa of caixas) {
    const pixels = recortarEEscalar(tinta, largura, altura, caixa, 28)
    const tensorDeEntrada = tf.tensor4d(pixels, [1, 28, 28, 1])
    const predicao = modelo.predict(tensorDeEntrada) as import('@tensorflow/tfjs').Tensor
    const probabilidades = await predicao.data()
    tensorDeEntrada.dispose()
    predicao.dispose()

    let melhorIndice = 0
    let melhorProbabilidade = probabilidades[0]!
    for (let i = 1; i < probabilidades.length; i++) {
      if (probabilidades[i]! > melhorProbabilidade) {
        melhorProbabilidade = probabilidades[i]!
        melhorIndice = i
      }
    }

    texto += caractereDoIndice(melhorIndice)
    confiancaMinima = Math.min(confiancaMinima, melhorProbabilidade)
  }

  return { texto, confiancaMinima }
}
