// Ponto único de registro: cada gerador novo (Etapas 8/9/10) só precisa de
// uma linha aqui pra ficar disponível ao motor via geradorId.
import { adicao } from './matematica/adicao.js'
import { areaRetangulo } from './matematica/area-retangulo.js'
import { areaTriangulo } from './matematica/area-triangulo.js'
import { avaliarExpressao } from './matematica/avaliar-expressao.js'
import { contagem } from './matematica/contagem.js'
import { decimalFracao } from './matematica/decimal-fracao.js'
import { decimalMultiplicacao } from './matematica/decimal-multiplicacao.js'
import { decimalSomaSubtracao } from './matematica/decimal-soma-subtracao.js'
import { derivadaEmPonto } from './matematica/derivada-em-ponto.js'
import { divisao } from './matematica/divisao.js'
import { equacaoDoisPassos } from './matematica/equacao-dois-passos.js'
import { equacaoSegundoGrau } from './matematica/equacao-segundo-grau.js'
import { equacaoUmPasso } from './matematica/equacao-um-passo.js'
import { fracaoComparar } from './matematica/fracao-comparar.js'
import { fracaoEquivalente } from './matematica/fracao-equivalente.js'
import { fracaoLer } from './matematica/fracao-ler.js'
import { fracaoOperacao } from './matematica/fracao-operacao.js'
import { fracaoSimplificar } from './matematica/fracao-simplificar.js'
import { inequacaoUmPasso } from './matematica/inequacao-um-passo.js'
import { integralDefinida } from './matematica/integral-definida.js'
import { leituraNumero } from './matematica/leitura-numero.js'
import { percentualConversao } from './matematica/percentual-conversao.js'
import { percentualDeNumero } from './matematica/percentual-de-numero.js'
import { percentualProblema } from './matematica/percentual-problema.js'
import { perimetroRetangulo } from './matematica/perimetro-retangulo.js'
import { perimetroTriangulo } from './matematica/perimetro-triangulo.js'
import { potencia } from './matematica/potencia.js'
import { raiz } from './matematica/raiz.js'
import { sequencia } from './matematica/sequencia.js'
import { sistema2x2 } from './matematica/sistema-2x2.js'
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
  registrarGerador('matematica.fracao-ler', fracaoLer)
  registrarGerador('matematica.fracao-equivalente', fracaoEquivalente)
  registrarGerador('matematica.fracao-comparar', fracaoComparar)
  registrarGerador('matematica.fracao-simplificar', fracaoSimplificar)
  registrarGerador('matematica.fracao-operacao', fracaoOperacao)
  registrarGerador('matematica.decimal-fracao', decimalFracao)
  registrarGerador('matematica.decimal-soma-subtracao', decimalSomaSubtracao)
  registrarGerador('matematica.decimal-multiplicacao', decimalMultiplicacao)
  registrarGerador('matematica.percentual-de-numero', percentualDeNumero)
  registrarGerador('matematica.percentual-conversao', percentualConversao)
  registrarGerador('matematica.percentual-problema', percentualProblema)
  registrarGerador('matematica.perimetro-retangulo', perimetroRetangulo)
  registrarGerador('matematica.area-retangulo', areaRetangulo)
  registrarGerador('matematica.perimetro-triangulo', perimetroTriangulo)
  registrarGerador('matematica.area-triangulo', areaTriangulo)
  registrarGerador('matematica.equacao-um-passo', equacaoUmPasso)
  registrarGerador('matematica.equacao-dois-passos', equacaoDoisPassos)
  registrarGerador('matematica.potencia', potencia)
  registrarGerador('matematica.raiz', raiz)
  registrarGerador('matematica.avaliar-expressao', avaliarExpressao)
  registrarGerador('matematica.sistema-2x2', sistema2x2)
  registrarGerador('matematica.inequacao-um-passo', inequacaoUmPasso)
  registrarGerador('matematica.equacao-segundo-grau', equacaoSegundoGrau)
  registrarGerador('matematica.derivada-em-ponto', derivadaEmPonto)
  registrarGerador('matematica.integral-definida', integralDefinida)
}
