import { ipcMain, app, shell } from 'electron'
import path from 'path'

export function registerAppHandlers() {
  // App info
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })

  ipcMain.handle('app:getPath', async (event, name) => {
    try {
      return app.getPath(name)
    } catch (error) {
      throw new Error(`Failed to get app path: ${error.message}`)
    }
  })

  ipcMain.handle('app:getAppPath', () => {
    return app.getAppPath()
  })

  ipcMain.handle('app:getTempPath', () => {
    return app.getPath('temp')
  })

  // Path operations
  ipcMain.handle('path:join', (event, ...paths) => {
    return path.join(...paths)
  })

  ipcMain.handle('path:basename', (event, filePath, ext) => {
    return path.basename(filePath, ext)
  })

  ipcMain.handle('path:dirname', (event, filePath) => {
    return path.dirname(filePath)
  })

  ipcMain.handle('path:extname', (event, filePath) => {
    return path.extname(filePath)
  })

  ipcMain.handle('path:parse', (event, filePath) => {
    return path.parse(filePath)
  })

  ipcMain.handle('path:normalize', (event, filePath) => {
    return path.normalize(filePath)
  })

  // Shell operations
  ipcMain.handle('shell:openExternal', async (event, url) => {
    try {
      await shell.openExternal(url)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to open external URL: ${error.message}`)
    }
  })

  ipcMain.handle('shell:showItemInFolder', async (event, filePath) => {
    try {
      shell.showItemInFolder(filePath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to show item in folder: ${error.message}`)
    }
  })
}