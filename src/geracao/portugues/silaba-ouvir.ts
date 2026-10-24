import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const silabaOuvir: FuncaoGeradora = (rng, parametros) => {
  const silabas = (parametros.silabas as string[] | undefined) ?? ['BA', 'BE', 'BI', 'BO', 'BU']
  const silaba = escolherUm(rng, silabas)

  return {
    tipo: 'textual',
    enunciado: 'Ouça com atenção e escreva a sílaba que você ouviu.',
    dados: { textoFala: silaba, idioma: 'pt-BR' },
    gabarito: silaba.toLowerCase(),
  }
}
