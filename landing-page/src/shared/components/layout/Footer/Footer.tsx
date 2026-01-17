import './Footer.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <span className="footer-logo">🎬 Teleprompter Stealth Mode</span>
                        <p className="footer-description">
                            Aplicação desktop para teleprompter invisível e discreto.
                            Ideal para reuniões, gravações e apresentações.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4 className="footer-title">Links</h4>
                            <ul className="footer-list">
                                <li><a href="/">Início</a></li>
                                <li><a href="/instructions">Como Usar</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Projeto</h4>
                            <ul className="footer-list">
                                <li>
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://drive.google.com/file/d/1hXM5QaSk303ydOrkiOLbHR4ktlu8YHVS/view?usp=drive_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} Teleprompter Stealth Mode. Desenvolvido com ❤️ usando Electron.</p>
                    <p className="footer-tech">
                        <span>Node.js</span>
                        <span>•</span>
                        <span>Electron</span>
                        <span>•</span>
                        <span>Markdown</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
