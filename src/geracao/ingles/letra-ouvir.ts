import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const letraOuvir: FuncaoGeradora = (rng, parametros) => {
  const letras = (parametros.letras as string[] | undefined) ?? ['A', 'B', 'C', 'D', 'E']
  const letra = escolherUm(rng, letras)

  return {
    tipo: 'textual',
    enunciado: 'Ouça com atenção e escreva a letra que você ouviu (em inglês).',
    dados: { textoFala: letra, idioma: 'en-US' },
    gabarito: letra.toLowerCase(),
  }
}
