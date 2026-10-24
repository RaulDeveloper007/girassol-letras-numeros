import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const leituraFrase: FuncaoGeradora = (rng, parametros) => {
  const frases = (parametros.frases as string[] | undefined) ?? []
  const frase = escolherUm(rng, frases)

  return {
    tipo: 'fala-leitura',
    enunciado: `Leia a frase em voz alta: ${frase}`,
    dados: { fraseAlvo: frase, idioma: 'pt-BR' },
    gabarito: frase,
  }
}
