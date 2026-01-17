import type { Feature } from '../types';

const FEATURES: Feature[] = [
    {
        id: '1',
        icon: '👁️',
        title: 'Janela Invisível',
        description: 'Interface transparente que permanece acima de outras janelas sem aparecer em capturas de tela.',
    },
    {
        id: '2',
        icon: '📝',
        title: 'Suporte a Markdown',
        description: 'Edite seu conteúdo com formatação rica usando Markdown. Títulos, listas, negrito e mais.',
    },
    {
        id: '3',
        icon: '🔄',
        title: 'Auto-scroll Inteligente',
        description: 'Rolagem automática com velocidade configurável de 0 a 100 pixels por segundo.',
    },
    {
        id: '4',
        icon: '🎨',
        title: 'Aparência Personalizável',
        description: 'Ajuste transparência, cor do texto, tamanho da fonte e alinhamento ao seu gosto.',
    },
    {
        id: '5',
        icon: '🖥️',
        title: 'Múltiplas Telas',
        description: 'Suporte completo para configurações com múltiplos monitores.',
    },
    {
        id: '6',
        icon: '⌨️',
        title: 'Atalhos Globais',
        description: 'Controle o aplicativo de qualquer lugar com Ctrl+T para mostrar/ocultar.',
    },
];

export function useFeatures() {
    return {
        features: FEATURES,
    };
}
