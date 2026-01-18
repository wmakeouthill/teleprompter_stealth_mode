import type { InstructionStep, KeyboardShortcut } from '../types';

// Use import.meta.env.BASE_URL for correct path resolution
const BASE = import.meta.env.BASE_URL;

const INSTRUCTION_STEPS: InstructionStep[] = [
    {
        id: '1',
        step: 1,
        title: 'Inicie o Aplicativo',
        description: 'Execute o arquivo Teleprompter Stealth. Não requer instalação - é um executável portável. A janela transparente aparecerá no centro da sua tela.',
        imageAlt: 'Screenshot: Tela inicial do Teleprompter',
        imageSrc: `${BASE}inicie_o_aplicativo.png`,
        mediaType: 'image',
    },
    {
        id: '2',
        step: 2,
        title: 'Abra o Painel de Configurações',
        description: 'Clique no botão ⚙ (engrenagem) no canto superior direito ou pressione ESC para abrir o painel de configurações com todas as opções disponíveis.',
        imageAlt: 'Screenshot: Painel de configurações aberto',
        imageSrc: `${BASE}abrir_o_painel_de_configuracoes.png`,
        mediaType: 'image',
    },
    {
        id: '3',
        step: 3,
        title: 'Carregue seu Conteúdo',
        description: 'Você pode carregar um arquivo Markdown (.md) ou texto (.txt), ou digitar/colar seu conteúdo diretamente no editor integrado. O conteúdo é salvo automaticamente.',
        imageAlt: 'Screenshot: Editor de conteúdo Markdown',
        imageSrc: `${BASE}carregue_seu_conteudo.png`,
        mediaType: 'image',
    },
    {
        id: '4',
        step: 4,
        title: 'Configure a Aparência',
        description: 'Ajuste a transparência da janela (30-50% recomendado para gravações), tamanho da fonte, cor do texto e alinhamento conforme sua preferência.',
        imageAlt: 'Screenshot: Controles de aparência',
        imageSrc: `${BASE}configure_a_aparencia.png`,
        mediaType: 'image',
    },
    {
        id: '5',
        step: 5,
        title: 'Ative o Auto-scroll',
        description: 'Use o slider de velocidade para configurar a rolagem automática. Durante a apresentação, pressione ESPAÇO para pausar/retomar o scroll quando necessário.',
        imageAlt: 'Vídeo: Demonstração do auto-scroll',
        imageSrc: `${BASE}ative_o_auto-scroll.webm`,
        mediaType: 'video',
    },
    {
        id: '6',
        step: 6,
        title: 'Posicione e Apresente',
        description: 'Mova a janela para a posição ideal próxima à sua câmera. Use Ctrl+T para mostrar/ocultar rapidamente. A janela permanece sempre no topo e invisível em capturas de tela.',
        imageAlt: 'Screenshot: Teleprompter em uso durante gravação',
        imageSrc: `${BASE}posicione_e_apresente.png`,
        mediaType: 'image',
    },
];

const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
    { key: 'Ctrl + T', description: 'Mostrar/Ocultar janela (minimizar/restaurar)', global: true },
    { key: 'ESC', description: 'Abrir/Fechar painel de configurações', global: false },
    { key: 'ESPAÇO', description: 'Pausar/Retomar auto-scroll', global: false },
    { key: 'Ctrl + Enter', description: 'Atualizar teleprompter (quando editor em foco)', global: false },
    { key: 'Ctrl + Q', description: 'Fechar aplicativo', global: false },
];

export function useInstructions() {
    return {
        steps: INSTRUCTION_STEPS,
        shortcuts: KEYBOARD_SHORTCUTS,
    };
}
