const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App lifecycle
  ready: () => ipcRenderer.send('READY'),
  quit: () => ipcRenderer.send('QUIT'),
  confirmCloseAck: () => ipcRenderer.send('CONFIRM_CLOSE_ACK'),
  
  // File operations
  openFile: (filePath) => ipcRenderer.send('OPEN_FILE', filePath),
  saveFile: () => ipcRenderer.send('SAVE'),
  saveCopyFile: () => ipcRenderer.send('SAVE_COPY'),
  openDialog: () => ipcRenderer.send('OPEN'),
  
  // Actions
  sendAction: (action) => ipcRenderer.send('ACTION', action),
  
  // Print/Export
  printSummary: (data) => ipcRenderer.send('PRINT_SUMMARY_DATA', data),
  
  // Listeners for main process events
  onOpenFile: (callback) => ipcRenderer.on('OPEN_FILE', (event, filePath) => callback(filePath)),
  onSave: (callback) => ipcRenderer.on('SAVE', callback),
  onSaveCopy: (callback) => ipcRenderer.on('SAVE_COPY', callback),
  onOpen: (callback) => ipcRenderer.on('OPEN', callback),
  onConfirmClose: (callback) => ipcRenderer.on('CONFIRM_CLOSE', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // Version info
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  }
});

// Expose a secure file system API for protocol operations
contextBridge.exposeInMainWorld('fileSystemAPI', {
  // Protocol file operations
  loadProtocol: (filePath) => ipcRenderer.invoke('fs:loadProtocol', filePath),
  saveProtocol: (filePath, data) => ipcRenderer.invoke('fs:saveProtocol', filePath, data),
  
  // Asset operations
  loadAsset: (assetPath) => ipcRenderer.invoke('fs:loadAsset', assetPath),
  saveAsset: (assetPath, data) => ipcRenderer.invoke('fs:saveAsset', assetPath, data),
  
  // Directory operations
  chooseDirectory: () => ipcRenderer.invoke('fs:chooseDirectory'),
  chooseFile: (filters) => ipcRenderer.invoke('fs:chooseFile', filters),
  
  // Validation
  validateProtocol: (data) => ipcRenderer.invoke('fs:validateProtocol', data)
});