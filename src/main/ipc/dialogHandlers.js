import { ipcMain, dialog, BrowserWindow } from 'electron'

export function registerDialogHandlers() {
  ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showOpenDialog(window, options)
      return result
    } catch (error) {
      throw new Error(`Failed to show open dialog: ${error.message}`)
    }
  })

  ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showSaveDialog(window, options)
      return result
    } catch (error) {
      throw new Error(`Failed to show save dialog: ${error.message}`)
    }
  })

  ipcMain.handle('dialog:showMessageBox', async (event, options) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showMessageBox(window, options)
      return result
    } catch (error) {
      throw new Error(`Failed to show message box: ${error.message}`)
    }
  })

  ipcMain.handle('dialog:showErrorBox', async (event, title, content) => {
    try {
      dialog.showErrorBox(title, content)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to show error box: ${error.message}`)
    }
  })
}