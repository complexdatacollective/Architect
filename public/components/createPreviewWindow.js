/**
 * Creates the preview window for Network Canvas.
 *
 * This window displays the interview preview using the network-canvas
 * submodule with the secure electronAPI preload script.
 */
const { BrowserWindow, Menu, app } = require('electron');
const path = require('path');
const log = require('./log');
const getPreviewMenu = require('./previewMenu');

// Get path to the network-canvas preload script
function getPreloadPath() {
  // Use app.getAppPath() for reliable path resolution
  // In development, this is the project root
  // In production, this is the app.asar or resources/app directory
  const appPath = app.getAppPath();

  if (process.env.NODE_ENV === 'development') {
    // Development: preload is in source location
    return path.join(appPath, 'network-canvas/public/preload/previewPreload.js');
  }

  // Production: preload is built to network-canvas/dist/preload/
  return path.join(appPath, 'network-canvas/dist/preload/index.js');
}

// Get the URL for the preview window
function getPreviewUrl() {
  // In development, use the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    // Network Canvas Vite dev server runs on port 3000
    return 'http://localhost:3000';
  }

  // In production, use the built renderer
  const appPath = app.getAppPath();
  return `file://${path.join(appPath, 'network-canvas/dist/renderer/index.html')}`;
}

/**
 * Creates and returns a promise that resolves with the preview BrowserWindow.
 */
function createPreviewWindow() {
  return new Promise((resolve, reject) => {
    const preloadPath = getPreloadPath();
    const previewUrl = getPreviewUrl();

    log.info('Creating preview window');
    log.info(`Preview preload: ${preloadPath}`);
    log.info(`Preview URL: ${previewUrl}`);

    global.previewWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      show: false,
      title: 'Network Canvas Preview',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath,
        webSecurity: true,
        allowRunningInsecureContent: false,
      },
    });

    // Set up the preview menu
    try {
      const previewMenu = Menu.buildFromTemplate(getPreviewMenu(global.previewWindow));
      global.previewWindow.setMenu(previewMenu);
    } catch (err) {
      log.error('Failed to set preview menu:', err);
    }

    // Handle window close - hide instead of destroy to allow reuse
    global.previewWindow.on('close', (event) => {
      event.preventDefault();
      global.previewWindow.hide();
    });

    // Log when window is ready
    global.previewWindow.webContents.on('did-finish-load', () => {
      log.info('Preview window loaded');
    });

    // Log any errors
    global.previewWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      log.error(`Preview window failed to load: ${errorDescription} (${errorCode})`);
    });

    // Handle console messages from preview window
    global.previewWindow.webContents.on('console-message', (event, level, message) => {
      if (level >= 2) { // warning or error
        log.warn(`[Preview] ${message}`);
      }
    });

    // Set window open handler to prevent opening new windows
    global.previewWindow.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });

    // Load the preview URL
    global.previewWindow.loadURL(previewUrl)
      .then(() => {
        log.info('Preview window URL loaded successfully');
        resolve(global.previewWindow);
      })
      .catch((err) => {
        log.error('Failed to load preview URL:', err);
        reject(err);
      });
  });
}

// Helper to show the index page
createPreviewWindow.showIndex = () => {
  if (global.previewWindow) {
    global.previewWindow.loadURL(getPreviewUrl());
  }
};

module.exports = createPreviewWindow;
