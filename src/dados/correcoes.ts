import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { Correcao, Item, Tentativa } from './tipos.js'

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

export interface ProducaoPendente {
  correcao: Correcao
  item: Item
  tentativa: Tentativa | undefined
}

/** Igual listarCorrecoesPendentesDeRevisao, mas já com o item e a resposta
 * escrita pelo aluno juntados -- é o que o painel do orientador precisa
 * mostrar de fato (não só o id do item). */
export async function listarProducoesPendentesDeRevisao(banco: BancoPassoCerto = obterBanco()): Promise<ProducaoPendente[]> {
  const pendentes = await listarCorrecoesPendentesDeRevisao(banco)

  const resultado: ProducaoPendente[] = []
  for (const correcao of pendentes) {
    const item = await banco.itens.get(correcao.itemId)
    if (!item) continue
    const tentativa = item.respostaFinalId ? await banco.tentativas.get(item.respostaFinalId) : undefined
    resultado.push({ correcao, item, tentativa })
  }
  return resultado
}
