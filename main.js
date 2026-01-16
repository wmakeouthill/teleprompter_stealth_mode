const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let tBubbleWindow = null;
let hiddenBounds = null;

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
  mainWindow.on('close', (event) => {
    // Não fechar realmente, apenas minimizar se Ctrl+T foi usado
    // Se for um close real (botão fechar ou Ctrl+Q), salvar e fechar
    // Para diferenciar, vamos salvar sempre mas não prevenir o close aqui
    // O preventDefault será usado apenas se necessário
    
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
    
    // Destruir bolinha T se existir
    destroyTBubble();
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

  // Função para criar bolinha T
  function createTBubble() {
    if (tBubbleWindow && !tBubbleWindow.isDestroyed()) {
      return; // Já existe
    }

    // Encontrar a tela onde o app principal está
    let targetDisplay = screen.getPrimaryDisplay();
    if (mainWindow && !mainWindow.isDestroyed() && hiddenBounds) {
      // Usar a posição salva para encontrar a tela correta
      const displays = screen.getAllDisplays();
      for (const display of displays) {
        const bounds = display.bounds;
        if (hiddenBounds.x >= bounds.x && 
            hiddenBounds.x < bounds.x + bounds.width &&
            hiddenBounds.y >= bounds.y && 
            hiddenBounds.y < bounds.y + bounds.height) {
          targetDisplay = display;
          break;
        }
      }
    } else if (mainWindow && !mainWindow.isDestroyed()) {
      // Se não houver posição salva, usar a posição atual
      const bounds = mainWindow.getBounds();
      const displays = screen.getAllDisplays();
      for (const display of displays) {
        const displayBounds = display.bounds;
        if (bounds.x >= displayBounds.x && 
            bounds.x < displayBounds.x + displayBounds.width &&
            bounds.y >= displayBounds.y && 
            bounds.y < displayBounds.y + displayBounds.height) {
          targetDisplay = display;
          break;
        }
      }
    }
    
    const bounds = targetDisplay.bounds;
    
    // Posição no canto INFERIOR direito da tela onde o app está
    // Considerando espaço para barra de tarefas do Windows
    const bubbleSize = 50;
    const margin = 20;
    const taskbarHeight = 35; // Altura aproximada da barra de tarefas (reduzido para ficar mais próximo)
    const x = bounds.x + bounds.width - bubbleSize - margin;
    const y = bounds.y + bounds.height - bubbleSize - margin - taskbarHeight; // Inferior direito, acima da barra de tarefas

    tBubbleWindow = new BrowserWindow({
      width: bubbleSize,
      height: bubbleSize,
      x: x,
      y: y,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Tentar proteger conteúdo de captura de tela
    if (process.platform === 'win32' || process.platform === 'linux') {
      tBubbleWindow.setContentProtection(true);
    }

    tBubbleWindow.loadFile('t-bubble.html');
    
    // Não permitir interação
    tBubbleWindow.setIgnoreMouseEvents(true, { forward: true });

    tBubbleWindow.on('closed', () => {
      tBubbleWindow = null;
    });
  }

  // Função para destruir bolinha T
  function destroyTBubble() {
    if (tBubbleWindow && !tBubbleWindow.isDestroyed()) {
      tBubbleWindow.close();
      tBubbleWindow = null;
    }
  }

  // Atualizar estado quando janela é minimizada/restaurada
  mainWindow.on('minimize', () => {
    // Mostrar bolinha T quando minimizar
    createTBubble();
  });

  mainWindow.on('restore', () => {
    // Esconder bolinha T quando restaurar
    destroyTBubble();
  });

  mainWindow.on('show', () => {
    // Esconder bolinha T quando mostrar
    destroyTBubble();
  });

  // Função para toggle visibilidade
  function toggleWindowVisibility() {
    if (!mainWindow || mainWindow.isDestroyed()) {
      // Se a janela foi destruída, não fazer nada (ou criar nova se necessário)
      return;
    }
    
    // Verificar se janela está minimizada ou não visível
    const isMinimized = mainWindow.isMinimized();
    const isVisible = mainWindow.isVisible();
    
    if (isMinimized || !isVisible) {
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
      mainWindow.restore(); // Garantir que não está minimizada
      destroyTBubble(); // Esconder bolinha T
    } else {
      // Esconder: salvar posição e minimizar
      hiddenBounds = mainWindow.getBounds();
      store.set('hiddenBounds', hiddenBounds);
      mainWindow.minimize();
      createTBubble(); // Mostrar bolinha T
    }
  }

  // Registrar atalho global Ctrl+T
  app.whenReady().then(() => {
    const ret = globalShortcut.register('CommandOrControl+T', () => {
      toggleWindowVisibility();
    });

    if (!ret) {
      console.log('Atalho global Ctrl+T não foi registrado');
    }
  });

  ipcMain.on('minimize-window', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.minimize();
      createTBubble(); // Mostrar bolinha T
    }
  });

  ipcMain.on('toggle-window-visibility', () => {
    toggleWindowVisibility();
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
  // Não fechar app se ainda houver a bolinha T
  if (tBubbleWindow && !tBubbleWindow.isDestroyed()) {
    return;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Remover atalhos globais ao fechar
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
