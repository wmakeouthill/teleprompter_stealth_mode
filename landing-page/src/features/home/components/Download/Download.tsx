import { Button, Card } from '@/shared/components/ui';
import './Download.css';

const DOWNLOAD_URL = 'https://drive.google.com/file/d/1hXM5QaSk303ydOrkiOLbHR4ktlu8YHVS/view?usp=drive_link';

export function Download() {
    return (
        <section id="download" className="download section">
            <div className="container">
                <Card variant="glass" className="download-card">
                    <div className="download-content">
                        <div className="download-info">
                            <h2 className="download-title">
                                Pronto para <span className="text-gradient">Começar?</span>
                            </h2>
                            <p className="download-description">
                                Baixe agora gratuitamente e experimente o teleprompter mais discreto do mercado.
                                Versão portável, não requer instalação.
                            </p>

                            <div className="download-details">
                                <div className="detail">
                                    <span className="detail-icon">📦</span>
                                    <div>
                                        <strong>Versão 1.0.0</strong>
                                        <span>Portable (.exe)</span>
                                    </div>
                                </div>
                                <div className="detail">
                                    <span className="detail-icon">💾</span>
                                    <div>
                                        <strong>~80 MB</strong>
                                        <span>Download rápido</span>
                                    </div>
                                </div>
                                <div className="detail">
                                    <span className="detail-icon">🔒</span>
                                    <div>
                                        <strong>Seguro</strong>
                                        <span>Código aberto</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => window.open(DOWNLOAD_URL, '_blank')}
                                className="download-btn"
                            >
                                🚀 Download para Windows
                            </Button>

                            <p className="download-note">
                                💡 Disponível também para macOS e Linux via build manual
                            </p>
                        </div>

                        <div className="download-visual">
                            <div className="app-preview">
                                <div className="preview-header">
                                    <span className="preview-dot" />
                                    <span className="preview-dot" />
                                    <span className="preview-dot" />
                                </div>
                                <div className="preview-content">
                                    <div className="preview-line" style={{ width: '70%' }} />
                                    <div className="preview-line" style={{ width: '100%' }} />
                                    <div className="preview-line" style={{ width: '85%' }} />
                                    <div className="preview-line" style={{ width: '60%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Coming Soon */}
                <div className="coming-soon">
                    <h3 className="coming-soon-title">🚧 Em Desenvolvimento</h3>
                    <p className="coming-soon-description">
                        Melhorias contínuas e novos recursos em breve:
                    </p>
                    <ul className="coming-soon-list">
                        <li>⚙️ Configurações avançadas de aparência</li>
                        <li>📱 Controle remoto via smartphone</li>
                        <li>☁️ Sincronização na nuvem</li>
                        <li>🎙️ Integração com softwares de streaming</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
