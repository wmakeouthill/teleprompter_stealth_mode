const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Elementos DOM
const controlPanel = document.getElementById('controlPanel');
const configBtn = document.getElementById('configBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const transparencySlider = document.getElementById('transparencySlider');
const transparencyValue = document.getElementById('transparencyValue');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const scrollPosition = document.getElementById('scrollPosition');
const scrollValue = document.getElementById('scrollValue');
const textAlign = document.getElementById('textAlign');
const backgroundColor = document.getElementById('backgroundColor');
const backgroundOpacity = document.getElementById('backgroundOpacity');
const bgOpacityValue = document.getElementById('bgOpacityValue');
const textColor = document.getElementById('textColor');
const loadFileBtn = document.getElementById('loadFileBtn');
const fileInput = document.getElementById('fileInput');
const markdownInput = document.getElementById('markdownInput');
const updateBtn = document.getElementById('updateBtn');
const resetBtn = document.getElementById('resetBtn');
const alwaysOnTop = document.getElementById('alwaysOnTop');
const screenSelect = document.getElementById('screenSelect');
const teleprompterContent = document.getElementById('teleprompterContent');
const teleprompterContainer = document.getElementById('teleprompterContainer');
const resizeHandle = document.getElementById('resizeHandle');

let autoScrollInterval = null;
let currentScrollSpeed = 0;
let savedScrollSpeed = 0; // Guarda a velocidade antes de pausar
let isResizing = false;
let isConfigOpen = false;

// Configurar marked para renderizar markdown
marked.setOptions({
    breaks: true,
    gfm: true
});

// Toggle painel de configurações
configBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    loadScreens(); // Carregar telas ao abrir
    toggleConfigPanel();
});

function toggleConfigPanel() {
    isConfigOpen = !isConfigOpen;
    if (isConfigOpen) {
        controlPanel.classList.add('show');
        // Desabilitar drag quando config está aberto para permitir interação
        const stealthControls = document.getElementById('stealthControls');
        stealthControls.style.webkitAppRegion = 'no-drag';
        document.body.style.webkitAppRegion = 'no-drag';
    } else {
        controlPanel.classList.remove('show');
        // Voltar a permitir arrastar no header quando config está fechado
        const stealthControls = document.getElementById('stealthControls');
        stealthControls.style.webkitAppRegion = 'drag';
        document.body.style.webkitAppRegion = 'drag';
    }
}

// Fechar painel ao clicar fora
document.addEventListener('click', (e) => {
    if (isConfigOpen && !controlPanel.contains(e.target) && !configBtn.contains(e.target)) {
        toggleConfigPanel();
    }
});

// Prevenir fechar ao clicar dentro do painel
controlPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Minimizar janela
minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    ipcRenderer.send('minimize-window');
});

// Fechar aplicativo
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    ipcRenderer.send('close-app');
});

// Controle de transparência
transparencySlider.addEventListener('input', (e) => {
    const opacity = parseFloat(e.target.value);
    transparencyValue.textContent = Math.round(opacity * 100) + '%';
    ipcRenderer.send('set-opacity', opacity);
    saveToLocalStorage('transparency', opacity);
});

// Controle de tamanho da fonte
fontSizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    fontSizeValue.textContent = size + 'px';
    teleprompterContent.style.fontSize = size + 'px';
    saveToLocalStorage('fontSize', size);
});

// Controle de velocidade de rolagem
speedSlider.addEventListener('input', (e) => {
    const speed = parseInt(e.target.value);
    currentScrollSpeed = speed;

    if (speed === 0) {
        speedValue.textContent = '0 (manual)';
        stopAutoScroll();
    } else {
        speedValue.textContent = speed + ' px/s';
        startAutoScroll(speed);
    }

    saveToLocalStorage('scrollSpeed', speed);
});

// Controle de posição de rolagem
scrollPosition.addEventListener('input', (e) => {
    const percent = parseFloat(e.target.value);
    scrollValue.textContent = percent.toFixed(1) + '%';

    const container = teleprompterContainer;
    const maxScroll = container.scrollHeight - container.clientHeight;
    container.scrollTop = (percent / 100) * maxScroll;
});

// Sincronizar scroll manual com slider
teleprompterContainer.addEventListener('scroll', () => {
    const container = teleprompterContainer;
    const scrollPercent = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;

    if (!isNaN(scrollPercent) && isFinite(scrollPercent)) {
        scrollPosition.value = scrollPercent;
        scrollValue.textContent = scrollPercent.toFixed(1) + '%';
    }
});

// Auto-scroll
function startAutoScroll(speed) {
    stopAutoScroll();

    autoScrollInterval = setInterval(() => {
        teleprompterContainer.scrollTop += speed / 10; // Atualiza a cada 100ms

        // Sincronizar slider
        const scrollPercent = (teleprompterContainer.scrollTop / (teleprompterContainer.scrollHeight - teleprompterContainer.clientHeight)) * 100;
        if (!isNaN(scrollPercent) && isFinite(scrollPercent)) {
            scrollPosition.value = scrollPercent;
            scrollValue.textContent = scrollPercent.toFixed(1) + '%';
        }

        // Parar se chegou ao fim
        if (teleprompterContainer.scrollTop >= teleprompterContainer.scrollHeight - teleprompterContainer.clientHeight) {
            stopAutoScroll();
            speedSlider.value = 0;
            speedValue.textContent = '0 (manual)';
        }
    }, 100);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// Controle de alinhamento
textAlign.addEventListener('change', (e) => {
    teleprompterContent.style.textAlign = e.target.value;
    saveToLocalStorage('textAlign', e.target.value);
});

// Controle de cor de fundo
backgroundColor.addEventListener('input', (e) => {
    updateBackgroundColor();
});

backgroundOpacity.addEventListener('input', (e) => {
    const opacity = parseInt(e.target.value);
    bgOpacityValue.textContent = opacity + '%';
    updateBackgroundColor();
});

function updateBackgroundColor() {
    const color = backgroundColor.value;
    const opacity = parseInt(backgroundOpacity.value) / 100;
    const rgb = hexToRgb(color);
    teleprompterContainer.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    saveToLocalStorage('backgroundColor', color);
    saveToLocalStorage('backgroundOpacity', parseInt(backgroundOpacity.value));
}

// Controle de cor do texto
textColor.addEventListener('input', (e) => {
    teleprompterContent.style.color = e.target.value;
    saveToLocalStorage('textColor', e.target.value);
});

// Função auxiliar para converter hex para RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Carregar arquivo
loadFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fs.readFile(file.path, 'utf8', (err, data) => {
            if (err) {
                alert('Erro ao ler arquivo: ' + err.message);
                return;
            }
            markdownInput.value = data;
            updateTeleprompter();
            // Salvar path completo e nome do arquivo carregado
            saveToLocalStorage('lastFilePath', file.path);
            saveToLocalStorage('lastFileName', file.name);
        });
    }
});

// Atualizar teleprompter
updateBtn.addEventListener('click', () => {
    updateTeleprompter();
});

function updateTeleprompter() {
    const markdown = markdownInput.value;
    if (markdown.trim()) {
        const html = marked.parse(markdown);
        teleprompterContent.innerHTML = html;

        // Salvar markdown no localStorage
        saveToLocalStorage('markdown', markdown);

        // Resetar scroll
        teleprompterContainer.scrollTop = 0;
        scrollPosition.value = 0;
        scrollValue.textContent = '0%';
    } else {
        teleprompterContent.innerHTML = '<div class="placeholder"><p>Carregue um arquivo Markdown ou digite o conteúdo nas configurações.</p><p>Use os controles para ajustar transparência e outras opções.</p></div>';
        // Remover markdown salvo se estiver vazio
        localStorage.removeItem('markdown');
    }
}

// Permitir Enter + Ctrl para atualizar no textarea
markdownInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        updateTeleprompter();
    }
});

// Resetar
resetBtn.addEventListener('click', () => {
    if (confirm('Deseja resetar todas as configurações?')) {
        transparencySlider.value = 1;
        transparencyValue.textContent = '100%';
        ipcRenderer.send('set-opacity', 1);

        fontSizeSlider.value = 32;
        fontSizeValue.textContent = '32px';
        teleprompterContent.style.fontSize = '32px';

        speedSlider.value = 0;
        speedValue.textContent = '0 (manual)';
        stopAutoScroll();

        scrollPosition.value = 0;
        scrollValue.textContent = '0%';
        teleprompterContainer.scrollTop = 0;

        textAlign.value = 'center';
        teleprompterContent.style.textAlign = 'center';

        backgroundColor.value = '#000000';
        backgroundOpacity.value = 0;
        bgOpacityValue.textContent = '0%';
        teleprompterContainer.style.backgroundColor = 'transparent';

        textColor.value = '#ffffff';
        teleprompterContent.style.color = '#ffffff';
    }
});

// Sempre no topo
alwaysOnTop.addEventListener('change', (e) => {
    ipcRenderer.send('toggle-always-on-top', e.target.checked);
    saveToLocalStorage('alwaysOnTop', e.target.checked);
});

// Carregar telas disponíveis
function loadScreens() {
    ipcRenderer.send('get-screens');
}

ipcRenderer.on('screens-list', (event, screens) => {
    // Limpar opções existentes (exceto "Tela Atual")
    while (screenSelect.children.length > 1) {
        screenSelect.removeChild(screenSelect.lastChild);
    }

    screens.forEach((screen, index) => {
        const option = document.createElement('option');
        option.value = index;
        const bounds = screen.bounds;
        option.textContent = `Tela ${index + 1} (${bounds.width}x${bounds.height})`;
        screenSelect.appendChild(option);
    });

    // Aplicar tela salva se houver
    const savedScreen = loadFromLocalStorage('selectedScreen', 'current');
    if (savedScreen !== 'current' && savedScreen !== null) {
        screenSelect.value = savedScreen;
    }
});

// Mudar de tela
screenSelect.addEventListener('change', (e) => {
    if (e.target.value === 'current') {
        saveToLocalStorage('selectedScreen', 'current');
        return; // Não fazer nada se for "Tela Atual"
    }
    const screenIndex = parseInt(e.target.value);
    saveToLocalStorage('selectedScreen', screenIndex);
    ipcRenderer.send('move-to-screen', screenIndex);
});


// Redimensionamento
let startX, startY, startWidth, startHeight;

resizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    startX = e.screenX;
    startY = e.screenY;

    // Obter tamanho atual da janela via IPC
    ipcRenderer.send('get-window-size');
    ipcRenderer.once('window-size', (event, width, height) => {
        startWidth = width;
        startHeight = height;
        isResizing = true;

        document.body.style.webkitAppRegion = 'no-drag';

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    });
});

function handleResize(e) {
    if (!isResizing || !startWidth || !startHeight) return;

    const deltaX = e.screenX - startX;
    const deltaY = e.screenY - startY;

    const newWidth = Math.max(200, startWidth + deltaX);
    const newHeight = Math.max(150, startHeight + deltaY);

    ipcRenderer.send('resize-window', Math.round(newWidth), Math.round(newHeight));
}

function stopResize() {
    isResizing = false;
    startWidth = null;
    startHeight = null;
    if (!isConfigOpen) {
        document.body.style.webkitAppRegion = 'drag';
    }
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}

// Prevenir arrastar em áreas interativas
configBtn.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

minimizeBtn.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

closeBtn.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

controlPanel.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

// Permitir arrastar em áreas vazias, mas não no texto renderizado
teleprompterContent.addEventListener('mousedown', (e) => {
    // Se clicou em elementos de texto, não permitir drag
    const clickableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'CODE', 'PRE', 'STRONG', 'EM', 'A', 'SPAN'];
    if (clickableTags.includes(e.target.tagName)) {
        e.stopPropagation();
    }
});

// Funções de persistência
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(`teleprompter_${key}`, JSON.stringify(value));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

function loadFromLocalStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(`teleprompter_${key}`);
        return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
        return defaultValue;
    }
}

// Carregar configurações salvas
function loadSavedSettings() {
    // Carregar markdown
    const savedMarkdown = loadFromLocalStorage('markdown', '');
    if (savedMarkdown) {
        markdownInput.value = savedMarkdown;
        updateTeleprompter();
    }

    // Carregar transparência
    const savedTransparency = loadFromLocalStorage('transparency', 1);
    transparencySlider.value = savedTransparency;
    transparencyValue.textContent = Math.round(savedTransparency * 100) + '%';
    ipcRenderer.send('set-opacity', savedTransparency);

    // Carregar tamanho da fonte
    const savedFontSize = loadFromLocalStorage('fontSize', 32);
    fontSizeSlider.value = savedFontSize;
    fontSizeValue.textContent = savedFontSize + 'px';
    teleprompterContent.style.fontSize = savedFontSize + 'px';

    // Carregar alinhamento
    const savedTextAlign = loadFromLocalStorage('textAlign', 'center');
    textAlign.value = savedTextAlign;
    teleprompterContent.style.textAlign = savedTextAlign;

    // Carregar cor do texto
    const savedTextColor = loadFromLocalStorage('textColor', '#ffffff');
    textColor.value = savedTextColor;
    teleprompterContent.style.color = savedTextColor;

    // Carregar cor de fundo
    const savedBgColor = loadFromLocalStorage('backgroundColor', '#000000');
    const savedBgOpacity = loadFromLocalStorage('backgroundOpacity', 0);
    backgroundColor.value = savedBgColor;
    backgroundOpacity.value = savedBgOpacity;
    bgOpacityValue.textContent = savedBgOpacity + '%';
    updateBackgroundColor();

    // Carregar sempre no topo
    const savedAlwaysOnTop = loadFromLocalStorage('alwaysOnTop', true);
    alwaysOnTop.checked = savedAlwaysOnTop;
    ipcRenderer.send('toggle-always-on-top', savedAlwaysOnTop);

    // Carregar velocidade de scroll
    const savedScrollSpeed = loadFromLocalStorage('scrollSpeed', 0);
    speedSlider.value = savedScrollSpeed;
    if (savedScrollSpeed > 0) {
        speedValue.textContent = savedScrollSpeed + ' px/s';
        currentScrollSpeed = savedScrollSpeed;
        startAutoScroll(savedScrollSpeed);
    }

    // Tela será carregada quando screens-list for recebido
    // Path do arquivo será carregado quando necessário
}

// Salvar markdown quando digitar no textarea
markdownInput.addEventListener('input', () => {
    // Usar debounce para não salvar a cada tecla
    clearTimeout(markdownInput.saveTimeout);
    markdownInput.saveTimeout = setTimeout(() => {
        saveToLocalStorage('markdown', markdownInput.value);
    }, 500);
});

// Salvar posição e tamanho da janela periodicamente
let saveWindowStateTimeout;
function saveWindowState() {
    clearTimeout(saveWindowStateTimeout);
    saveWindowStateTimeout = setTimeout(() => {
        ipcRenderer.send('get-window-bounds');
    }, 500);
}

// Salvar quando a janela for movida ou redimensionada
window.addEventListener('resize', saveWindowState);
// O evento de mover será tratado no main.js

// Receber bounds da janela para salvar
ipcRenderer.on('window-bounds', (event, bounds) => {
    saveToLocalStorage('windowBounds', bounds);
});

// Inicializar valores padrão ou carregar salvos
loadSavedSettings();

// Teclas de atalho
document.addEventListener('keydown', (e) => {
    // ESC para abrir/fechar configurações (toggle)
    if (e.key === 'Escape') {
        e.preventDefault();
        if (!isConfigOpen) {
            loadScreens(); // Carregar telas ao abrir
        }
        toggleConfigPanel();
    }

    // Espaço para pausar/retomar auto-scroll
    if (e.key === ' ' && !e.target.matches('textarea, input')) {
        e.preventDefault();
        if (autoScrollInterval) {
            // Está rolando, pausar
            savedScrollSpeed = currentScrollSpeed; // Salvar velocidade atual
            stopAutoScroll();
            speedSlider.value = 0;
            speedValue.textContent = '0 (pausado)';
            currentScrollSpeed = 0;
        } else if (savedScrollSpeed > 0) {
            // Está pausado e tinha velocidade salva, retomar
            currentScrollSpeed = savedScrollSpeed;
            speedSlider.value = savedScrollSpeed;
            speedValue.textContent = savedScrollSpeed + ' px/s';
            startAutoScroll(savedScrollSpeed);
        }
    }

    // Ctrl+Q para fechar
    if (e.key === 'q' && e.ctrlKey) {
        e.preventDefault();
        ipcRenderer.send('close-app');
    }

    // Ctrl+T para toggle minimizar/mostrar
    if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        ipcRenderer.send('toggle-window-visibility');
    }
});
