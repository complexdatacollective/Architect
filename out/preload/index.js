"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  // App lifecycle
  ready: () => ipcRenderer.send("READY"),
  quit: () => ipcRenderer.send("QUIT"),
  confirmCloseAck: () => ipcRenderer.send("CONFIRM_CLOSE_ACK"),
  // File operations (legacy - to be migrated to fileSystemAPI)
  openFile: (filePath) => ipcRenderer.send("OPEN_FILE", filePath),
  saveFile: () => ipcRenderer.send("SAVE"),
  saveCopyFile: () => ipcRenderer.send("SAVE_COPY"),
  openDialog: () => ipcRenderer.send("OPEN"),
  // Actions
  sendAction: (action) => ipcRenderer.send("ACTION", action),
  // Print/Export
  printSummary: (data) => ipcRenderer.send("PRINT_SUMMARY_DATA", data),
  // Listeners for main process events
  onOpenFile: (callback) => ipcRenderer.on("OPEN_FILE", (event, filePath) => callback(filePath)),
  onSave: (callback) => ipcRenderer.on("SAVE", callback),
  onSaveCopy: (callback) => ipcRenderer.on("SAVE_COPY", callback),
  onOpen: (callback) => ipcRenderer.on("OPEN", callback),
  onConfirmClose: (callback) => ipcRenderer.on("CONFIRM_CLOSE", callback),
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  // Platform info
  platform: process.platform,
  // Version info
  getVersion: () => ipcRenderer.invoke("app:getVersion"),
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});
contextBridge.exposeInMainWorld("fileSystemAPI", {
  // File operations
  readFile: (filePath, encoding) => ipcRenderer.invoke("fs:readFile", filePath, encoding),
  writeFile: (filePath, data, encoding) => ipcRenderer.invoke("fs:writeFile", filePath, data, encoding),
  readJson: (filePath) => ipcRenderer.invoke("fs:readJson", filePath),
  writeJson: (filePath, data) => ipcRenderer.invoke("fs:writeJson", filePath, data),
  // Directory operations
  readdir: (dirPath) => ipcRenderer.invoke("fs:readdir", dirPath),
  mkdir: (dirPath) => ipcRenderer.invoke("fs:mkdir", dirPath),
  mkdirp: (dirPath) => ipcRenderer.invoke("fs:mkdirp", dirPath),
  // File management
  copy: (src, dest) => ipcRenderer.invoke("fs:copy", src, dest),
  rename: (oldPath, newPath) => ipcRenderer.invoke("fs:rename", oldPath, newPath),
  unlink: (filePath) => ipcRenderer.invoke("fs:unlink", filePath),
  remove: (path) => ipcRenderer.invoke("fs:remove", path),
  // File info
  stat: (path) => ipcRenderer.invoke("fs:stat", path),
  pathExists: (path) => ipcRenderer.invoke("fs:pathExists", path),
  access: (path, mode) => ipcRenderer.invoke("fs:access", path, mode),
  // Protocol specific operations
  loadProtocol: (filePath) => ipcRenderer.invoke("fs:loadProtocol", filePath),
  saveProtocol: (filePath, data) => ipcRenderer.invoke("fs:saveProtocol", filePath, data),
  importNetcanvas: (filePath) => ipcRenderer.invoke("fs:importNetcanvas", filePath),
  exportNetcanvas: (workingPath, filePath) => ipcRenderer.invoke("fs:exportNetcanvas", workingPath, filePath),
  // Asset operations
  loadAsset: (assetPath) => ipcRenderer.invoke("fs:loadAsset", assetPath),
  saveAsset: (assetPath, data) => ipcRenderer.invoke("fs:saveAsset", assetPath, data),
  importAsset: (sourcePath, destPath) => ipcRenderer.invoke("fs:importAsset", sourcePath, destPath),
  // Archive operations
  createArchive: (sourcePath, destPath) => ipcRenderer.invoke("fs:createArchive", sourcePath, destPath),
  extractArchive: (archivePath, destPath) => ipcRenderer.invoke("fs:extractArchive", archivePath, destPath),
  // Validation
  validateProtocol: (data) => ipcRenderer.invoke("fs:validateProtocol", data)
});
contextBridge.exposeInMainWorld("dialogAPI", {
  showOpenDialog: (options) => ipcRenderer.invoke("dialog:showOpenDialog", options),
  showSaveDialog: (options) => ipcRenderer.invoke("dialog:showSaveDialog", options),
  showMessageBox: (options) => ipcRenderer.invoke("dialog:showMessageBox", options),
  showErrorBox: (title, content) => ipcRenderer.invoke("dialog:showErrorBox", title, content)
});
contextBridge.exposeInMainWorld("pathAPI", {
  join: (...paths) => ipcRenderer.invoke("path:join", ...paths),
  basename: (path, ext) => ipcRenderer.invoke("path:basename", path, ext),
  dirname: (path) => ipcRenderer.invoke("path:dirname", path),
  extname: (path) => ipcRenderer.invoke("path:extname", path),
  parse: (path) => ipcRenderer.invoke("path:parse", path),
  normalize: (path) => ipcRenderer.invoke("path:normalize", path)
});
contextBridge.exposeInMainWorld("appAPI", {
  getPath: (name) => ipcRenderer.invoke("app:getPath", name),
  getAppPath: () => ipcRenderer.invoke("app:getAppPath"),
  getTempPath: () => ipcRenderer.invoke("app:getTempPath")
});
contextBridge.exposeInMainWorld("shellAPI", {
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  showItemInFolder: (path) => ipcRenderer.invoke("shell:showItemInFolder", path)
});
contextBridge.exposeInMainWorld("csvAPI", {
  parseCSV: (data, options) => ipcRenderer.invoke("csv:parse", data, options),
  convertCSVToJSON: (filePath, options) => ipcRenderer.invoke("csv:convertToJSON", filePath, options)
});
