import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { Correcao } from './tipos.js'

export function salvarCorrecao(correcao: Correcao, banco: BancoPassoCerto = obterBanco()): Promise<string> {
  return banco.correcoes.put(correcao)
}

export function obterCorrecao(itemId: string, banco: BancoPassoCerto = obterBanco()): Promise<Correcao | undefined> {
  return banco.correcoes.get(itemId)
}

/** Fila do orientador: produções livres (rubrica) ainda não revisadas. */
export async function listarCorrecoesPendentesDeRevisao(banco: BancoPassoCerto = obterBanco()): Promise<Correcao[]> {
  const todas = await banco.correcoes.toArray()
  return todas.filter((correcao) => correcao.metodo === 'rubrica' && !correcao.revisadoPeloOrientador)
}

export function marcarCorrecaoRevisada(itemId: string, banco: BancoPassoCerto = obterBanco()): Promise<number> {
  return banco.correcoes.update(itemId, { revisadoPeloOrientador: true })
}
