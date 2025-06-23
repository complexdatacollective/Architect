import { ipcMain, BrowserWindow, app } from 'electron'

// Global state for managing the app
let mainWindow = null

export function setMainWindow(window) {
  mainWindow = window
}

export function registerLegacyHandlers() {
  // Legacy lifecycle handlers
  ipcMain.on('READY', (event) => {
    console.log('Renderer process is ready')
    // You can perform any initialization here
  })

  ipcMain.on('QUIT', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  ipcMain.on('CONFIRM_CLOSE_ACK', () => {
    console.log('Close confirmation acknowledged')
    // Handle close confirmation
  })

  // Legacy file operation handlers
  ipcMain.on('OPEN_FILE', (event, filePath) => {
    // This should trigger opening a file in the renderer
    if (mainWindow) {
      mainWindow.webContents.send('OPEN_FILE', filePath)
    }
  })

  ipcMain.on('SAVE', (event) => {
    // Trigger save in renderer
    if (mainWindow) {
      mainWindow.webContents.send('SAVE')
    }
  })

  ipcMain.on('SAVE_COPY', (event) => {
    // Trigger save copy in renderer
    if (mainWindow) {
      mainWindow.webContents.send('SAVE_COPY')
    }
  })

  ipcMain.on('OPEN', (event) => {
    // Trigger open dialog in renderer
    if (mainWindow) {
      mainWindow.webContents.send('OPEN')
    }
  })

  // Legacy action handler
  ipcMain.on('ACTION', (event, action) => {
    console.log('Received action:', action.type)
    
    // Handle specific actions
    switch (action.type) {
      case 'SESSION/OPEN_NETCANVAS_SUCCESS':
      case 'SESSION/SAVE_NETCANVAS_SUCCESS':
      case 'SESSION/RESET':
      case 'SESSION/PROTOCOL_CHANGED':
        // These actions might need to update menus or app state
        // You can emit events or call functions to handle these
        break
      case 'PRINT_SUMMARY_DATA':
        // Handle print summary
        if (action.payload) {
          // TODO: Implement print summary window
          console.log('Print summary requested', action.payload)
        }
        break
      default:
        console.log('Unhandled action:', action)
    }
  })

  // Print handler
  ipcMain.on('PRINT_SUMMARY_DATA', (event, data) => {
    console.log('Print summary data received', data)
    // TODO: Implement print summary window creation
  })
}