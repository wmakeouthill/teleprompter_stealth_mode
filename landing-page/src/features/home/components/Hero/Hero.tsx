import type { UseCase } from '@/features/home/types';
import { Button } from '@/shared/components/ui';
import './Hero.css';

const DOWNLOAD_URL = 'https://drive.google.com/file/d/1hXM5QaSk303ydOrkiOLbHR4ktlu8YHVS/view?usp=drive_link';

interface HeroProps {
    useCase: UseCase;
    currentIndex: number;
    totalCases: number;
    onNext: () => void;
    onPrev: () => void;
    onGoTo: (index: number) => void;
    onPause: () => void;
    onResume: () => void;
}

export function Hero({
    useCase,
    currentIndex,
    totalCases,
    onNext,
    onPrev,
    onGoTo,
    onPause,
    onResume,
}: HeroProps) {
    return (
        <section className="hero" onMouseEnter={onPause} onMouseLeave={onResume}>
            <div className="hero-bg">
                <div className="hero-glow hero-glow-1" />
                <div className="hero-glow hero-glow-2" />
            </div>

            <div className="hero-content container">
                <div className="hero-split">
                    {/* Left Side - Text Content */}
                    <div className="hero-text">
                        <h1 className="hero-title animate-fade-in">
                            <span className="text-gradient">Teleprompter</span>
                            <br />
                            Stealth Mode
                        </h1>

                        <p className="hero-subtitle animate-fade-in">
                            Aplicação desktop para teleprompter invisível e discreto.
                            Perfeito para reuniões online, gravações de vídeo e apresentações ao vivo.
                        </p>

                        {/* CTA Buttons */}
                        <div className="hero-actions animate-fade-in">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => window.open(DOWNLOAD_URL, '_blank')}
                            >
                                🚀 Download Gratuito
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Conhecer Recursos
                            </Button>
                        </div>

                        {/* Platform Info */}
                        <div className="hero-platforms animate-fade-in">
                            <span>Disponível para:</span>
                            <div className="platforms">
                                <span className="platform">🪟 Windows</span>
                                <span className="platform">🍎 macOS</span>
                                <span className="platform">🐧 Linux</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Carousel */}
                    <div className="hero-carousel">
                        <div className="carousel animate-fade-in">
                            <button
                                className="carousel-btn carousel-prev"
                                onClick={onPrev}
                                aria-label="Caso de uso anterior"
                            >
                                ‹
                            </button>

                            <div className="carousel-content glass-light">
                                <div className="carousel-icon">{useCase.icon}</div>
                                <h3 className="carousel-title">{useCase.title}</h3>
                                <p className="carousel-description">{useCase.description}</p>
                            </div>

                            <button
                                className="carousel-btn carousel-next"
                                onClick={onNext}
                                aria-label="Próximo caso de uso"
                            >
                                ›
                            </button>
                        </div>

                        {/* Indicators */}
                        <div className="carousel-indicators">
                            {Array.from({ length: totalCases }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`indicator ${i === currentIndex ? 'indicator-active' : ''}`}
                                    onClick={() => onGoTo(i)}
                                    aria-label={`Ir para slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
