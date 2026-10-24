# SETUP_VOZ.md — Etapa 1: preparação do ambiente de voz

Esta etapa prepara o Xiaomi Redmi 9 e o PC com Windows 11 para que o app
tenha síntese de voz (pt-BR e en-US) e reconhecimento de fala offline, que é
**obrigatório** no método. Nenhum conteúdo de currículo foi alterado nesta
etapa — ela só prepara os dois aparelhos.

## Por que isso é manual

O ADB e o PowerShell conseguem automatizar boa parte do caminho, mas o
download dos pacotes de voz (TTS) e dos pacotes de reconhecimento offline
depende de telas da MIUI e do app Google que não têm um comando equivalente
— por isso os scripts abrem a tela certa e pausam para você concluir o
download manualmente.

## 1. Redmi 9 (via ADB, a partir do Windows)

**Antes de rodar o script**, no celular:
1. Configurações → Sobre o telefone → toque 7× em "Versão da MIUI" até
   aparecer "Você agora é um desenvolvedor!".
2. Configurações → Configurações adicionais → Opções do desenvolvedor →
   ative **Depuração USB** e **Depuração USB (Configurações de segurança)**.
3. Conecte o cabo USB e, na notificação do Android, escolha
   **Transferência de arquivos**.

**Rode no PowerShell comum** (não precisa ser administrador):

```powershell
cd caminho\até\girassol-letras-numeros\scripts
.\setup-voz-android.ps1
```

O script vai, com sua confirmação a cada passo:
- verificar/instalar o ADB (Android Platform Tools);
- confirmar que o celular aparece como `device`;
- verificar/instalar o pacote "Serviços de fala do Google" (TTS);
- definir esse serviço como mecanismo padrão de conversão de texto em voz;
- abrir a tela de TTS para você baixar as vozes **Português (Brasil)** e
  **Inglês (Estados Unidos)**;
- abrir as configurações do app Google para você baixar o **reconhecimento
  de fala offline** nos dois idiomas;
- abrir as permissões do Chrome para você liberar o microfone.

## 2. Windows 11

**Rode em um PowerShell como Administrador**
(menu Iniciar → "PowerShell" → clique direito → "Executar como
administrador"):

```powershell
cd caminho\até\girassol-letras-numeros\scripts
.\setup-voz-windows.ps1
```

O script vai, com sua confirmação a cada passo:
- listar as capacidades de voz (`Get-WindowsCapability`);
- instalar síntese de voz (`TextToSpeech`) em pt-BR e en-US;
- instalar reconhecimento de fala (`Speech`) em pt-BR e en-US;
- abrir `ms-settings:speech` para você confirmar visualmente;
- abrir `ms-settings:privacy-microphone` para você liberar o microfone
  para o navegador.

## 3. Verificar nos dois aparelhos

Depois de rodar os dois scripts, abra o app (local ou publicado) em cada
aparelho e acesse a tela de diagnóstico:

```
#/verificar-voz
```

(Ela também está linkada no Painel do Responsável, em "Diagnóstico
técnico".)

A tela mostra:
1. **Lista de vozes instaladas** — confira que há pelo menos uma linha
   `pt-*` e uma `en-*` marcadas como **✅ offline** (`localService: true`).
   Se aparecer só "⚠️ online", volte ao passo 1 ou 2 e baixe os pacotes de
   voz do sistema.
2. **Teste de síntese** — toca a frase de teste nos dois idiomas.
3. **Teste de reconhecimento** — pede para você falar a frase de teste e
   mostra a transcrição.

## Checklist (marque após testar em cada aparelho)

| Item | Redmi 9 | Windows 11 |
|---|:---:|:---:|
| Síntese pt-BR (offline) | ⬜ | ✅ |
| Síntese en-US (offline) | ⬜ | ✅ |
| Reconhecimento pt-BR | ⬜ | ✅ |
| Reconhecimento en-US | ⬜ | ✅ |
| Permissão de microfone concedida ao navegador | ⬜ | ✅ |

## O que esta etapa NÃO faz

- Não instala ainda o motor de reconhecimento em WebAssembly (Camada 2,
  para funcionar 100% offline mesmo quando a Web Speech API do navegador
  exigir rede) — isso entra na Etapa 5 (Motor de Correção), junto com o
  serviço de fala em 3 camadas descrito no prompt.
- A tela "Verificar voz" testa apenas a Camada 1 (Web Speech API do
  navegador). Se o reconhecimento funcionar aqui mas exigir internet no seu
  Chrome/Edge específico, isso será resolvido pela Camada 2 na Etapa 5 —
  não é motivo para travar esta etapa.

## Pendências conhecidas

- O item 6 do script do Redmi 9 (reconhecimento offline do app Google) usa
  um caminho de tela que pode variar entre versões do app Google. Se os
  passos descritos não baterem com o que você vê, procure por "offline"
  dentro de Configurações → Voz do app Google, ou me avise a tela exata que
  apareceu para eu ajustar o script.
