import { escolherUm } from '../aleatorio.js'
import type { Rubrica } from '../../correcao/rubrica.js'
import type { FuncaoGeradora } from '../tipos.js'

interface PromptDeRedacao {
  tema: string
  instrucao: string
}

// Produção livre nunca tem gabarito -- ela sempre vai pra autoavaliação por
// rubrica e depois pra fila do orientador (ver correcao/rubrica.ts). Por
// isso não tem como ser um ponto de calibração do diagnóstico adaptativo
// (orquestracao.ts filtra esse tipo de bloco de propósito).
export const producaoLivre: FuncaoGeradora = (rng, parametros) => {
  const temas = (parametros.temas as PromptDeRedacao[] | undefined) ?? []
  const rubrica = parametros.rubrica as Rubrica
  const escolhido = escolherUm(rng, temas)

  return {
    tipo: 'producao-livre',
    enunciado: `${escolhido.instrucao}\n\nTema: ${escolhido.tema}`,
    dados: { tema: escolhido.tema, rubrica },
    gabarito: null,
  }
}
