import { createId } from '../generators/shared/id.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { TentativaDeFala } from './tipos.js'

export async function salvarTentativaDeFala(
  dados: Omit<TentativaDeFala, 'id' | 'criadoEm' | 'numero'>,
  banco: BancoPassoCerto = obterBanco()
): Promise<TentativaDeFala> {
  const tentativasAnteriores = await banco.tentativasDeFala.where('itemId').equals(dados.itemId).count()

  const tentativa: TentativaDeFala = {
    ...dados,
    numero: tentativasAnteriores + 1,
    id: createId(),
    criadoEm: new Date().toISOString(),
  }
  await banco.tentativasDeFala.put(tentativa)
  return tentativa
}

/** Fila do orientador: tentativas de fala que esgotaram as 3 chances. */
export async function listarTentativasDeFalaEncaminhadas(banco: BancoPassoCerto = obterBanco()): Promise<TentativaDeFala[]> {
  const todas = await banco.tentativasDeFala.toArray()
  return todas.filter((tentativa) => tentativa.encaminhadoParaOrientador)
}
