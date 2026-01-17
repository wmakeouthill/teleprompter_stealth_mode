import { useState, useEffect, useCallback } from 'react';
import type { UseCase } from '../types';

const USE_CASES: UseCase[] = [
    {
        id: '1',
        icon: '📋',
        title: 'Reuniões e Apresentações',
        description: 'Leia suas anotações discretamente durante reuniões online. A janela transparente permanece invisível para os outros participantes enquanto você mantém contato visual com a câmera.',
    },
    {
        id: '2',
        icon: '🎬',
        title: 'Entrevistas em Vídeo',
        description: 'Prepare-se para entrevistas de emprego ou podcasts. Mantenha seus pontos-chave visíveis na tela enquanto grava, garantindo respostas fluidas e profissionais.',
    },
    {
        id: '3',
        icon: '📺',
        title: 'Gravações para YouTube',
        description: 'Crie conteúdo para YouTube sem decorar roteiros. Configure o auto-scroll para acompanhar seu ritmo de fala e produza vídeos de alta qualidade com facilidade.',
    },
];

export function useUseCases() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextCase = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % USE_CASES.length);
    }, []);

    const prevCase = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + USE_CASES.length) % USE_CASES.length);
    }, []);

    const goToCase = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const pause = useCallback(() => setIsPaused(true), []);
    const resume = useCallback(() => setIsPaused(false), []);

    // Auto-rotate carousel
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(nextCase, 5000);
        return () => clearInterval(interval);
    }, [nextCase, isPaused]);

    return {
        useCases: USE_CASES,
        currentUseCase: USE_CASES[currentIndex],
        currentIndex,
        totalCases: USE_CASES.length,
        nextCase,
        prevCase,
        goToCase,
        pause,
        resume,
        isPaused,
    };
}
