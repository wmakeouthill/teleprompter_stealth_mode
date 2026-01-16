# Teleprompter Stealth Mode

Um aplicativo Electron que funciona como teleprompter invisível para reuniões e gravação com OBS. O aplicativo exibe conteúdo em Markdown de forma transparente, permitindo que você leia enquanto grava vídeos ou participa de reuniões online.

## Características

- ✅ Janela transparente e sempre no topo
- ✅ Suporte completo para Markdown
- ✅ Controle de transparência ajustável
- ✅ Controle de tamanho e cor da fonte
- ✅ Auto-scroll configurável
- ✅ Controle manual de posição de rolagem
- ✅ Alinhamento de texto configurável
- ✅ Controle de cor de fundo e texto
- ✅ Carregamento de arquivos .md ou .txt
- ✅ Editor de markdown integrado

## Instalação

1. Certifique-se de ter Node.js instalado (versão 16 ou superior)

2. Instale as dependências:
```bash
npm install
```

## Como Usar

1. Inicie o aplicativo:
```bash
npm start
```

2. **Carregar conteúdo:**
   - Clique em "Carregar Arquivo Markdown" para abrir um arquivo .md ou .txt
   - Ou digite/cole o conteúdo Markdown diretamente no editor

3. **Ajustar transparência:**
   - Use o slider "Transparência" para ajustar a opacidade da janela
   - 100% = totalmente opaco (você vê bem)
   - Menor valor = mais transparente (menos visível para câmeras)

4. **Personalizar aparência:**
   - Ajuste o tamanho da fonte para melhor legibilidade
   - Mude as cores de texto e fundo conforme necessário
   - Configure o alinhamento do texto

5. **Controlar rolagem:**
   - **Manual:** Use o slider "Posição de Rolagem" ou a barra de rolagem
   - **Automático:** Ajuste a "Velocidade de Rolagem" (em pixels por segundo)
   - Pressione **ESPAÇO** para pausar/retomar o auto-scroll

6. **Atalhos de teclado:**
   - **ESC:** Mostrar/Ocultar painel de controles
   - **ESPAÇO:** Pausar/Retomar auto-scroll
   - **Ctrl + Enter:** Atualizar teleprompter (quando focado no editor)

## Sobre a "Invisibilidade"

**Importante:** A janela transparente pode não ser 100% invisível para todas as ferramentas de captura. Alguns fatores afetam isso:

- **OBS Studio:** Pode capturar janelas transparentes dependendo das configurações. Configure o OBS para capturar apenas janelas específicas ou use um segundo monitor.
- **Ferramentas de reunião:** Zoom, Teams, etc. podem ou não capturar dependendo das configurações.
- **Soluções alternativas:**
  - Use um segundo monitor para o teleprompter
  - Configure o OBS para não capturar a janela do teleprompter
  - Use a transparência para deixar menos visível (mas ainda legível para você)

## Dicas de Uso

1. **Para gravação:** Configure transparência baixa (30-50%) para que você veja bem, mas não apareça tanto na captura
2. **Para reuniões:** Ajuste conforme necessário, considerando que pode aparecer parcialmente
3. **Auto-scroll:** Pratique a velocidade antes de gravar/apresentar
4. **Posicionamento:** Arraste a janela para onde for mais confortável ler

## Estrutura do Projeto

```
teleprompter_stealth_mode/
├── main.js           # Processo principal do Electron
├── renderer.js       # Lógica da interface
├── index.html        # Estrutura HTML
├── styles.css        # Estilos e layout
├── package.json      # Dependências e scripts
└── README.md         # Este arquivo
```

## Personalização

Você pode personalizar:
- Cores padrão no CSS
- Tamanhos de fonte padrão
- Comportamento da janela no `main.js`
- Atalhos de teclado no `renderer.js`

## Requisitos

- Node.js 16+
- Electron 28+
- Windows 10/11, macOS ou Linux

## Notas

- A janela é configurada para não aparecer na barra de tarefas
- A janela permanece sempre no topo por padrão
- O painel de controles pode ser minimizado clicando no cabeçalho
- O conteúdo é renderizado em tempo real usando a biblioteca `marked`

## Licença

MIT
