import { carregarFase, listarFasesDisponiveis } from '../curriculo/loader.js'
import type { BlocoDeclarado, DisciplinaId } from '../curriculo/tipos.js'

export interface PontoCurriculo {
  faseNumero: number
  nivelNumero: number
  bloco: BlocoDeclarado
}

/**
 * Lista todos os blocos de uma disciplina em sequência (fase, depois
 * nível, depois bloco), na ordem em que aparecem no currículo declarativo
 * -- do mais fácil ao mais difícil. É sobre essa lista que o diagnóstico
 * adaptativo faz a busca binária.
 */
export async function listarBlocosLineares(disciplina: DisciplinaId): Promise<PontoCurriculo[]> {
  const fases = listarFasesDisponiveis(disciplina)
  const pontos: PontoCurriculo[] = []

  for (const faseNumero of fases) {
    const fase = await carregarFase(disciplina, faseNumero)
    for (const nivel of fase.niveis) {
      for (const bloco of nivel.blocos) {
        pontos.push({ faseNumero, nivelNumero: nivel.numero, bloco })
      }
    }
  }

  return pontos
}
