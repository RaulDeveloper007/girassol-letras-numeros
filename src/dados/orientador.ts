import { createId } from '../generators/shared/id.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { ComentarioOrientador, ConfiguracoesOrientador } from './tipos.js'

const ID_SINGLETON = 'singleton' as const

export async function obterConfiguracoesOrientador(banco: BancoPassoCerto = obterBanco()): Promise<ConfiguracoesOrientador> {
  const existente = await banco.configuracoesOrientador.get(ID_SINGLETON)
  if (existente) return existente

  const padrao: ConfiguracoesOrientador = { id: ID_SINGLETON, pinHash: null, ultimoBackupEm: null }
  await banco.configuracoesOrientador.put(padrao)
  return padrao
}

export async function salvarConfiguracoesOrientador(
  parcial: Partial<Omit<ConfiguracoesOrientador, 'id'>>,
  banco: BancoPassoCerto = obterBanco()
): Promise<ConfiguracoesOrientador> {
  const atual = await obterConfiguracoesOrientador(banco)
  const atualizado: ConfiguracoesOrientador = { ...atual, ...parcial }
  await banco.configuracoesOrientador.put(atualizado)
  return atualizado
}

export function listarComentarios(alunoId: string, banco: BancoPassoCerto = obterBanco()): Promise<ComentarioOrientador[]> {
  return banco.comentariosOrientador.where('alunoId').equals(alunoId).toArray()
}

export async function salvarComentario(
  alunoId: string,
  texto: string,
  banco: BancoPassoCerto = obterBanco()
): Promise<ComentarioOrientador> {
  const comentario: ComentarioOrientador = {
    id: createId(),
    alunoId,
    texto,
    criadoEm: new Date().toISOString(),
    lidoPeloAluno: false,
  }
  await banco.comentariosOrientador.put(comentario)
  return comentario
}

export function marcarComentarioLido(id: string, banco: BancoPassoCerto = obterBanco()): Promise<number> {
  return banco.comentariosOrientador.update(id, { lidoPeloAluno: true })
}
