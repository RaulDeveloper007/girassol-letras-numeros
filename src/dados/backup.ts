// Exportação/importação manual de todo o banco -- é a ÚNICA forma dos
// dados saírem do aparelho (restrição de privacidade do projeto). Genérico
// por nome de tabela, igual ao backup.js antigo, só que sobre o Dexie.
import { obterBanco, type BancoPassoCerto } from './banco.js'

const VERSAO_DO_ESQUEMA = 2

export interface BackupPassoCerto {
  versaoDoEsquema: number
  exportadoEm: string
  dados: Record<string, unknown[]>
}

export async function exportarBackup(banco: BancoPassoCerto = obterBanco()): Promise<BackupPassoCerto> {
  const dados: Record<string, unknown[]> = {}
  for (const tabela of banco.tables) {
    dados[tabela.name] = await tabela.toArray()
  }
  return { versaoDoEsquema: VERSAO_DO_ESQUEMA, exportadoEm: new Date().toISOString(), dados }
}

export function baixarArquivoDeBackup(backup: BackupPassoCerto): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const data = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `passo-certo-backup-${data}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function importarBackup(backup: unknown, banco: BancoPassoCerto = obterBanco()): Promise<void> {
  if (!backup || typeof backup !== 'object' || !('dados' in backup)) {
    throw new Error('Arquivo de backup inválido.')
  }
  const tipado = backup as BackupPassoCerto
  if (tipado.versaoDoEsquema !== VERSAO_DO_ESQUEMA) {
    throw new Error('Versão de backup incompatível com este app.')
  }

  await banco.transaction('rw', banco.tables, async () => {
    for (const tabela of banco.tables) {
      const registros = tipado.dados[tabela.name]
      if (!Array.isArray(registros)) continue
      await tabela.clear()
      await tabela.bulkPut(registros)
    }
  })
}
