import { useInstructions } from '../hooks';
import { Card, ImagePlaceholder, Button } from '@/shared/components/ui';
import './InstructionsPage.css';

const DOWNLOAD_URL = 'https://drive.google.com/file/d/1hXM5QaSk303ydOrkiOLbHR4ktlu8YHVS/view?usp=drive_link';

export function InstructionsPage() {
    const { steps, shortcuts } = useInstructions();

    return (
        <main className="instructions-page">
            {/* Page Header */}
            <section className="instructions-header section">
                <div className="container">
                    <h1 className="page-title">
                        Como <span className="text-gradient">Usar</span>
                    </h1>
                    <p className="page-subtitle">
                        Guia completo para começar a usar o Teleprompter Stealth Mode em poucos minutos
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="steps-section section">
                <div className="container">
                    <div className="steps-grid">
                        {steps.map((step) => (
                            <div key={step.id} className="step-item">
                                <div className="step-number">
                                    <span>{step.step}</span>
                                </div>
                                <div className="step-content">
                                    <Card variant="glass" className="step-card">
                                        <h3 className="step-title">{step.title}</h3>
                                        <p className="step-description">{step.description}</p>
                                        <div className="step-media">
                                            {step.mediaType === 'video' ? (
                                                <video
                                                    className="step-video"
                                                    src={step.imageSrc}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    aria-label={step.imageAlt}
                                                />
                                            ) : step.imageSrc ? (
                                                <img
                                                    className="step-image"
                                                    src={step.imageSrc}
                                                    alt={step.imageAlt}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <ImagePlaceholder alt={step.imageAlt} aspectRatio="16/9" />
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Keyboard Shortcuts Section */}
            <section className="shortcuts-section section">
                <div className="container">
                    <h2 className="section-title">
                        ⌨️ Atalhos de <span className="text-gradient">Teclado</span>
                    </h2>
                    <p className="section-subtitle">
                        Controle o aplicativo rapidamente com estes atalhos
                    </p>

                    <Card variant="glass" className="shortcuts-card">
                        <table className="shortcuts-table">
                            <thead>
                                <tr>
                                    <th>Atalho</th>
                                    <th>Ação</th>
                                    <th>Escopo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shortcuts.map((shortcut) => (
                                    <tr key={shortcut.key}>
                                        <td>
                                            <kbd className="shortcut-key">{shortcut.key}</kbd>
                                        </td>
                                        <td>{shortcut.description}</td>
                                        <td>
                                            <span className={`scope-badge ${shortcut.global ? 'scope-global' : 'scope-local'}`}>
                                                {shortcut.global ? 'Global' : 'Local'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </section>

            {/* Tips Section */}
            <section className="tips-section section">
                <div className="container">
                    <h2 className="section-title">
                        💡 Dicas <span className="text-gradient">Profissionais</span>
                    </h2>

                    <div className="tips-grid">
                        <Card variant="feature" hover className="tip-card">
                            <div className="tip-icon">🎬</div>
                            <h3 className="tip-title">Para Gravações</h3>
                            <ul className="tip-list">
                                <li>Transparência 30-50% para equilibrar visibilidade</li>
                                <li>Pratique a velocidade do auto-scroll antes de gravar</li>
                                <li>Posicione a janela perto da câmera</li>
                                <li>Faça um teste antes da sessão real</li>
                            </ul>
                        </Card>

                        <Card variant="feature" hover className="tip-card">
                            <div className="tip-icon">📋</div>
                            <h3 className="tip-title">Para Reuniões</h3>
                            <ul className="tip-list">
                                <li>Use uma tela separada se possível</li>
                                <li>Transparência 40-60% para garantir legibilidade</li>
                                <li>Prepare o conteúdo antes da reunião</li>
                                <li>Pratique os atalhos para controle rápido</li>
                            </ul>
                        </Card>

                        <Card variant="feature" hover className="tip-card">
                            <div className="tip-icon">📝</div>
                            <h3 className="tip-title">Formatação Markdown</h3>
                            <ul className="tip-list">
                                <li>Use # para títulos e pausas visuais</li>
                                <li>**Negrito** para destaque</li>
                                <li>Listas para organizar pontos</li>
                                <li>&gt; Citações para notas importantes</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section section">
                <div className="container">
                    <Card variant="glass" className="cta-card">
                        <h2 className="cta-title">Pronto para começar?</h2>
                        <p className="cta-description">
                            Baixe agora e experimente o teleprompter mais discreto do mercado
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => window.open(DOWNLOAD_URL, '_blank')}
                        >
                            🚀 Download Gratuito
                        </Button>
                    </Card>
                </div>
            </section>
        </main>
    );
}
