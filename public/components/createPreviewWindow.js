const log = require('./log');

/**
 * Preview window creation is DISABLED.
 *
 * The network-canvas submodule requires modernization to support
 * Electron security features (context isolation, preload scripts).
 * Until that work is complete, preview functionality is unavailable.
 *
 * This file returns a no-op stub to maintain compatibility with
 * code that expects the preview window to exist.
 */

const PREVIEW_DISABLED_MESSAGE = 'Preview is currently unavailable. The network-canvas submodule requires modernization to support Electron security features.';

// No-op stub for preview window
const previewWindowStub = {
  show: () => log.warn(PREVIEW_DISABLED_MESSAGE),
  hide: () => {},
  close: () => {},
  loadURL: () => log.warn(PREVIEW_DISABLED_MESSAGE),
  showIndex: () => log.warn(PREVIEW_DISABLED_MESSAGE),
  setContentSize: () => {},
  webContents: {
    send: () => log.warn(PREVIEW_DISABLED_MESSAGE),
    on: () => {},
    once: () => {},
    removeAllListeners: () => {},
    setWindowOpenHandler: () => {},
  },
  on: () => {},
  once: () => {},
  removeAllListeners: () => {},
};

function createPreviewWindow() {
  log.warn(PREVIEW_DISABLED_MESSAGE);
  global.previewWindow = previewWindowStub;
  return Promise.resolve(previewWindowStub);
}

module.exports = createPreviewWindow;
