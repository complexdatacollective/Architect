const { ipcMain } = require('electron');
const log = require('./log');

const PREVIEW_DISABLED_MESSAGE = 'Preview is currently unavailable. The network-canvas submodule requires modernization to support Electron security features.';

/**
 * PreviewManager is DISABLED.
 *
 * Preview functionality requires the network-canvas submodule to be
 * modernized with Electron security features before it can be re-enabled.
 */
class PreviewManager {
  static showIndex() {
    log.warn(PREVIEW_DISABLED_MESSAGE);
  }

  static send() {
    // No-op - preview is disabled
  }

  static quit() {
    // No-op - preview is disabled
  }

  start() {
    log.info('PreviewManager: Preview mode is DISABLED');
    log.warn(PREVIEW_DISABLED_MESSAGE);

    // Register IPC handlers that return immediately (no-op)
    ipcMain.on('preview:preview', () => {
      log.warn(PREVIEW_DISABLED_MESSAGE);
    });

    ipcMain.on('preview:clear', () => {
      // No-op
    });

    ipcMain.on('preview:close', () => {
      // No-op
    });

    ipcMain.on('preview:reset', () => {
      // No-op
    });
  }
}

module.exports = PreviewManager;
