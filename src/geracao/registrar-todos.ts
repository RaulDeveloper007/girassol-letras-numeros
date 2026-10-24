// Ponto único de registro: cada gerador novo (Etapas 8/9/10) só precisa de
// uma linha aqui pra ficar disponível ao motor via geradorId.
import { adicao } from './matematica/adicao.js'
import { contagem } from './matematica/contagem.js'
import { divisao } from './matematica/divisao.js'
import { leituraNumero } from './matematica/leitura-numero.js'
import { sequencia } from './matematica/sequencia.js'
import { subtracao } from './matematica/subtracao.js'
import { sucessorAntecessor } from './matematica/sucessor-antecessor.js'
import { tabuada } from './matematica/tabuada.js'
import { registrarGerador } from './registro.js'

export function registrarTodosOsGeradores(): void {
  registrarGerador('matematica.contagem', contagem)
  registrarGerador('matematica.leitura-numero', leituraNumero)
  registrarGerador('matematica.sucessor-antecessor', sucessorAntecessor)
  registrarGerador('matematica.sequencia', sequencia)
  registrarGerador('matematica.adicao', adicao)
  registrarGerador('matematica.subtracao', subtracao)
  registrarGerador('matematica.tabuada', tabuada)
  registrarGerador('matematica.divisao', divisao)
}
