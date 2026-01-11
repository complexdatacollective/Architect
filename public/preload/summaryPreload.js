/**
 * Preload script for the printable summary window.
 * Exposes a limited API via contextBridge for the summary view.
 */
const { contextBridge, ipcRenderer } = require('electron');

// Whitelist of valid IPC channels for receive (main -> renderer)
const validReceiveChannels = [
  'SUMMARY_DATA',
];

contextBridge.exposeInMainWorld('electronAPI', {
  // ===================
  // IPC Communication
  // ===================
  ipc: {
    on: (channel, callback) => {
      if (validReceiveChannels.includes(channel)) {
        const subscription = (event, ...args) => callback(...args);
        ipcRenderer.on(channel, subscription);
        return () => ipcRenderer.removeListener(channel, subscription);
      }
      console.warn(`[electronAPI] Invalid receive channel: ${channel}`);
      return () => {};
    },
    once: (channel, callback) => {
      if (validReceiveChannels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => callback(...args));
      } else {
        console.warn(`[electronAPI] Invalid once channel: ${channel}`);
      }
    },
  },

  // ===================
  // Dialog Operations
  // ===================
  dialog: {
    showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSave', options),
  },

  // ===================
  // File System Operations (limited)
  // ===================
  fs: {
    writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
  },

  // ===================
  // Path Operations (limited)
  // ===================
  path: {
    basename: (filePath, ext) => ipcRenderer.invoke('path:basename', filePath, ext),
    dirname: (filePath) => ipcRenderer.invoke('path:dirname', filePath),
    join: (...args) => ipcRenderer.invoke('path:join', ...args),
  },

  // ===================
  // Window Operations
  // ===================
  window: {
    hide: () => ipcRenderer.invoke('window:hide'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  // ===================
  // WebContents Operations
  // ===================
  webContents: {
    printToPDF: (options) => ipcRenderer.invoke('webContents:printToPDF', options),
  },

  // ===================
  // Platform Info
  // ===================
  platform: process.platform,
});

console.log('[electronAPI] Summary preload script loaded');
