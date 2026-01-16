const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
  // Carregar configurações salvas da janela
  const savedBounds = store.get('windowBounds', null);
  const savedOpacity = store.get('opacity', 1.0);
  const savedAlwaysOnTop = store.get('alwaysOnTop', true);
  
  const defaultWidth = 1200;
  const defaultHeight = 800;
  
  // Criar janela transparente e sempre no topo
  mainWindow = new BrowserWindow({
    width: savedBounds ? savedBounds.width : defaultWidth,
    height: savedBounds ? savedBounds.height : defaultHeight,
    x: savedBounds ? savedBounds.x : undefined,
    y: savedBounds ? savedBounds.y : undefined,
    frame: false, // Sem bordas
    transparent: true, // Janela transparente
    alwaysOnTop: savedAlwaysOnTop, // Sempre no topo
    skipTaskbar: true, // Não aparece na barra de tarefas
    resizable: true,
    hasShadow: false, // Sem sombra para ser mais stealth
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    opacity: savedOpacity
  });

  // Tentar proteger conteúdo de captura de tela (Windows/Linux)
  if (process.platform === 'win32' || process.platform === 'linux') {
    mainWindow.setContentProtection(true);
  }

  mainWindow.loadFile('index.html');

  // Abrir DevTools em modo desenvolvimento (comentado por padrão)
  // mainWindow.webContents.openDevTools();

  // Salvar estado da janela antes de fechar (evento 'close' é antes de destruir)
  mainWindow.on('close', () => {
    // Salvar estado da janela ao fechar (antes de ser destruída)
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        const bounds = mainWindow.getBounds();
        store.set('windowBounds', bounds);
        store.set('opacity', mainWindow.getOpacity());
        store.set('alwaysOnTop', mainWindow.isAlwaysOnTop());
      }
    } catch (err) {
      // Ignorar erros ao salvar (janela pode estar sendo destruída)
      // Não fazer nada, apenas evitar crash
    }
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Salvar bounds periodicamente (ao mover ou redimensionar)
  let saveBoundsTimeout;
  mainWindow.on('move', () => {
    clearTimeout(saveBoundsTimeout);
    saveBoundsTimeout = setTimeout(() => {
      try {
        if (mainWindow && !mainWindow.isDestroyed()) {
          const bounds = mainWindow.getBounds();
          store.set('windowBounds', bounds);
        }
      } catch (error) {
        // Ignorar erros
      }
    }, 500);
  });
  
  mainWindow.on('resize', () => {
    clearTimeout(saveBoundsTimeout);
    saveBoundsTimeout = setTimeout(() => {
      try {
        if (mainWindow && !mainWindow.isDestroyed()) {
          const bounds = mainWindow.getBounds();
          store.set('windowBounds', bounds);
        }
      } catch (error) {
        // Ignorar erros
      }
    }, 500);
  });

  // IPC handlers
  ipcMain.on('set-opacity', (event, opacity) => {
    if (mainWindow) {
      mainWindow.setOpacity(opacity);
      store.set('opacity', opacity);
    }
  });

  ipcMain.on('close-app', () => {
    app.quit();
  });

  ipcMain.on('toggle-always-on-top', (event, value) => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(value);
      store.set('alwaysOnTop', value);
    }
  });

  // Estado para controlar visibilidade (para toggle)
  let isWindowVisible = true;
  let hiddenBounds = null;

  // Atualizar estado quando janela é minimizada/restaurada
  mainWindow.on('minimize', () => {
    isWindowVisible = false;
  });

  mainWindow.on('restore', () => {
    isWindowVisible = true;
  });

  mainWindow.on('show', () => {
    isWindowVisible = true;
  });

  ipcMain.on('minimize-window', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.minimize();
    }
  });

  ipcMain.on('toggle-window-visibility', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    
    // Verificar se janela está visível
    const currentlyVisible = mainWindow.isVisible() && !mainWindow.isMinimized();
    
    if (currentlyVisible) {
      // Esconder: salvar posição e minimizar
      hiddenBounds = mainWindow.getBounds();
      store.set('hiddenBounds', hiddenBounds);
      mainWindow.minimize();
      isWindowVisible = false;
    } else {
      // Mostrar: restaurar posição
      if (hiddenBounds) {
        mainWindow.setBounds(hiddenBounds);
      } else {
        // Tentar carregar posição salva
        const savedBounds = store.get('windowBounds', null);
        if (savedBounds) {
          mainWindow.setBounds(savedBounds);
        }
      }
      mainWindow.show();
      mainWindow.focus();
      isWindowVisible = true;
    }
  });

  ipcMain.on('resize-window', (event, width, height) => {
    if (mainWindow) {
      mainWindow.setSize(width, height);
    }
  });

  ipcMain.on('get-window-size', (event) => {
    if (mainWindow) {
      const size = mainWindow.getSize();
      event.reply('window-size', size[0], size[1]);
    }
  });

  ipcMain.on('get-screens', (event) => {
    const displays = screen.getAllDisplays();
    const screensInfo = displays.map(display => ({
      bounds: display.bounds,
      id: display.id
    }));
    event.reply('screens-list', screensInfo);
  });

  ipcMain.on('move-to-screen', (event, screenIndex) => {
    if (mainWindow) {
      const displays = screen.getAllDisplays();
      if (screenIndex >= 0 && screenIndex < displays.length) {
        const targetDisplay = displays[screenIndex];
        const bounds = targetDisplay.bounds;
        
        // Mover para o centro da tela selecionada
        const x = bounds.x + (bounds.width / 2) - (mainWindow.getSize()[0] / 2);
        const y = bounds.y + (bounds.height / 2) - (mainWindow.getSize()[1] / 2);
        
        mainWindow.setPosition(Math.round(x), Math.round(y));
        // Salvar tela selecionada
        store.set('selectedScreen', screenIndex);
      }
    }
  });
  
  ipcMain.on('get-window-bounds', (event) => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      event.reply('window-bounds', bounds);
    }
  });
  
  ipcMain.on('load-window-bounds', (event) => {
    // Este handler é chamado pelo renderer para aplicar bounds salvos
    // Mas já aplicamos no createWindow, então não precisamos fazer nada aqui
  });

  // Atalhos globais (opcional)
  // Você pode adicionar atalhos de teclado aqui se necessário
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
