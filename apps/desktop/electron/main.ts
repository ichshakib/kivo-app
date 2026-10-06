import { app, BrowserWindow, Menu, nativeTheme } from 'electron';
import { autoUpdater } from 'electron-updater';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.name = 'Kivo';
app.setAppUserModelId('com.kivo.workspace');

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function updateTitleBarTheme() {
  if (!win || win.isDestroyed()) return;
  const isDark = nativeTheme.shouldUseDarkColors;
  const bg = isDark ? '#111111' : '#f8f9fa';
  const symbol = isDark ? '#ededed' : '#111827';

  if (process.platform === 'win32') {
    win.setTitleBarOverlay({
      color: bg,
      symbolColor: symbol,
      height: 36,
    });
  }
  win.setBackgroundColor(bg);
}

function createWindow() {
  Menu.setApplicationMenu(null);

  const isDark = nativeTheme.shouldUseDarkColors;
  const bg = isDark ? '#111111' : '#f8f9fa';
  const symbol = isDark ? '#ededed' : '#111827';

  win = new BrowserWindow({
    title: 'Kivo',
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: bg,
      symbolColor: symbol,
      height: 36,
    },
    backgroundColor: bg,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.removeMenu();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

function setupAutoUpdater() {
  if (app.isPackaged) {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.error('Error checking for updates:', err);
    });
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  nativeTheme.on('updated', () => {
    updateTitleBarTheme();
  });
});
