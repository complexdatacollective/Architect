/**
 * PreviewManager handles IPC communication for the preview window.
 *
 * This manages the lifecycle and messaging for the Network Canvas preview
 * window, allowing Architect to remote-control the interview preview.
 */
const { ipcMain } = require('electron');
const log = require('./log');
const createPreviewWindow = require('./createPreviewWindow');

/**
 * PreviewManager class that handles all preview-related IPC communication.
 */
class PreviewManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Send a message to the preview window.
   * @param {string} channel - The IPC channel name
   * @param {...any} args - Arguments to send
   */
  static send(channel, ...args) {
    if (global.previewWindow && !global.previewWindow.isDestroyed()) {
      global.previewWindow.webContents.send(channel, ...args);
    } else {
      log.warn(`PreviewManager: Cannot send to channel ${channel} - preview window not available`);
    }
  }

  /**
   * Show the preview window's index page.
   */
  static showIndex() {
    if (global.previewWindow && !global.previewWindow.isDestroyed()) {
      createPreviewWindow.showIndex();
    } else {
      log.warn('PreviewManager: Cannot show index - preview window not available');
    }
  }

  /**
   * Clean up and quit the preview window.
   */
  static quit() {
    if (global.previewWindow && !global.previewWindow.isDestroyed()) {
      // Remove the close prevention handler
      global.previewWindow.removeAllListeners('close');
      global.previewWindow.close();
      global.previewWindow = null;
    }
  }

  /**
   * Initialize the preview manager and start listening for IPC events.
   */
  start() {
    if (this.isInitialized) {
      log.warn('PreviewManager: Already initialized');
      return;
    }

    log.info('PreviewManager: Starting...');

    // Handle preview request - show window and send protocol data
    ipcMain.on('preview:preview', (event, protocol, stageIndex) => {
      log.info(`PreviewManager: Received preview request for stage ${stageIndex}`);

      if (!global.previewWindow || global.previewWindow.isDestroyed()) {
        log.warn('PreviewManager: Preview window not available, creating...');
        createPreviewWindow()
          .then(() => {
            this.handlePreviewRequest(protocol, stageIndex);
          })
          .catch((err) => {
            log.error('PreviewManager: Failed to create preview window:', err);
          });
      } else {
        this.handlePreviewRequest(protocol, stageIndex);
      }
    });

    // Handle preview clear - reset preview state
    ipcMain.on('preview:clear', () => {
      log.info('PreviewManager: Received clear request');

      if (global.previewWindow && !global.previewWindow.isDestroyed()) {
        PreviewManager.send('remote:reset');
      }
    });

    // Handle preview close - hide the window
    ipcMain.on('preview:close', () => {
      log.info('PreviewManager: Received close request');

      if (global.previewWindow && !global.previewWindow.isDestroyed()) {
        global.previewWindow.hide();
      }
    });

    // Handle preview reset - return to index
    ipcMain.on('preview:reset', () => {
      log.info('PreviewManager: Received reset request');

      if (global.previewWindow && !global.previewWindow.isDestroyed()) {
        PreviewManager.send('remote:reset');
        PreviewManager.showIndex();
      }
    });

    this.isInitialized = true;
    log.info('PreviewManager: Started successfully');
  }

  /**
   * Handle a preview request by showing the window and sending protocol data.
   * @param {object} protocol - The protocol to preview
   * @param {number} stageIndex - The stage index to start at
   */
  handlePreviewRequest(protocol, stageIndex) {
    if (!global.previewWindow || global.previewWindow.isDestroyed()) {
      log.warn('PreviewManager: Cannot handle preview request - window not available');
      return;
    }

    // Show the window
    global.previewWindow.show();

    // Send the preview data to the preview window
    PreviewManager.send('remote:preview', protocol, stageIndex);

    log.info(`PreviewManager: Sent preview data for stage ${stageIndex}`);
  }
}

module.exports = PreviewManager;
