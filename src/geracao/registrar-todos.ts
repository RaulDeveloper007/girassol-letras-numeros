// Ponto único de registro: cada gerador novo (Etapas 8/9/10) só precisa de
// uma linha aqui pra ficar disponível ao motor via geradorId.
import { adicao } from './matematica/adicao.js'
import { contagem } from './matematica/contagem.js'
import { registrarGerador } from './registro.js'

export function registrarTodosOsGeradores(): void {
  registrarGerador('matematica.contagem', contagem)
  registrarGerador('matematica.adicao', adicao)
}
