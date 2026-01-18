import { useState, useEffect, useCallback, useRef } from 'react';
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

const AUTO_INTERVAL = 6000;      // 6 seconds for auto-rotation
const MANUAL_DELAY = 15000;      // 15 seconds after manual interaction

export function useUseCases() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [delay, setDelay] = useState(AUTO_INTERVAL);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const scheduleNext = useCallback((customDelay?: number) => {
        clearTimer();
        const nextDelay = customDelay ?? delay;
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % USE_CASES.length);
            setDelay(AUTO_INTERVAL); // Reset to normal interval after auto-advance
        }, nextDelay);
    }, [delay, clearTimer]);

    // Auto-advance carousel
    useEffect(() => {
        if (isPaused) {
            clearTimer();
            return;
        }

        scheduleNext();

        return () => clearTimer();
    }, [isPaused, currentIndex, scheduleNext, clearTimer]);

    const nextCase = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % USE_CASES.length);
        setDelay(MANUAL_DELAY); // User interacted, use longer delay
    }, []);

    const prevCase = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + USE_CASES.length) % USE_CASES.length);
        setDelay(MANUAL_DELAY); // User interacted, use longer delay
    }, []);

    const goToCase = useCallback((index: number) => {
        setCurrentIndex(index);
        setDelay(MANUAL_DELAY); // User interacted, use longer delay
    }, []);

    const pause = useCallback(() => setIsPaused(true), []);
    const resume = useCallback(() => setIsPaused(false), []);

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
