import { ipcMain } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import archiver from 'archiver'
import decompress from 'decompress'

export function registerFileHandlers() {
  // File operations
  ipcMain.handle('fs:readFile', async (event, filePath, encoding = 'utf8') => {
    try {
      return await fs.readFile(filePath, encoding)
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`)
    }
  })

  ipcMain.handle('fs:writeFile', async (event, filePath, data, encoding = 'utf8') => {
    try {
      await fs.writeFile(filePath, data, encoding)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to write file: ${error.message}`)
    }
  })

  ipcMain.handle('fs:readJson', async (event, filePath) => {
    try {
      return await fs.readJson(filePath)
    } catch (error) {
      throw new Error(`Failed to read JSON file: ${error.message}`)
    }
  })

  ipcMain.handle('fs:writeJson', async (event, filePath, data) => {
    try {
      await fs.writeJson(filePath, data, { spaces: 2 })
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to write JSON file: ${error.message}`)
    }
  })

  // Directory operations
  ipcMain.handle('fs:readdir', async (event, dirPath) => {
    try {
      return await fs.readdir(dirPath)
    } catch (error) {
      throw new Error(`Failed to read directory: ${error.message}`)
    }
  })

  ipcMain.handle('fs:mkdir', async (event, dirPath) => {
    try {
      await fs.mkdir(dirPath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to create directory: ${error.message}`)
    }
  })

  ipcMain.handle('fs:mkdirp', async (event, dirPath) => {
    try {
      await fs.mkdirp(dirPath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to create directory path: ${error.message}`)
    }
  })

  // File management
  ipcMain.handle('fs:copy', async (event, src, dest) => {
    try {
      await fs.copy(src, dest)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to copy: ${error.message}`)
    }
  })

  ipcMain.handle('fs:rename', async (event, oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to rename: ${error.message}`)
    }
  })

  ipcMain.handle('fs:unlink', async (event, filePath) => {
    try {
      await fs.unlink(filePath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  })

  ipcMain.handle('fs:remove', async (event, targetPath) => {
    try {
      await fs.remove(targetPath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to remove: ${error.message}`)
    }
  })

  // File info
  ipcMain.handle('fs:stat', async (event, targetPath) => {
    try {
      const stats = await fs.stat(targetPath)
      return {
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        created: stats.birthtime,
        modified: stats.mtime
      }
    } catch (error) {
      throw new Error(`Failed to get file stats: ${error.message}`)
    }
  })

  ipcMain.handle('fs:pathExists', async (event, targetPath) => {
    try {
      return await fs.pathExists(targetPath)
    } catch (error) {
      throw new Error(`Failed to check path existence: ${error.message}`)
    }
  })

  ipcMain.handle('fs:access', async (event, targetPath, mode) => {
    try {
      await fs.access(targetPath, mode)
      return true
    } catch (error) {
      return false
    }
  })

  // Archive operations
  ipcMain.handle('fs:createArchive', async (event, sourcePath, destPath) => {
    try {
      return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(destPath)
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', () => {
          resolve({ success: true, size: archive.pointer() })
        })

        archive.on('error', (err) => {
          reject(new Error(`Archive creation failed: ${err.message}`))
        })

        archive.pipe(output)
        archive.directory(sourcePath, false)
        archive.finalize()
      })
    } catch (error) {
      throw new Error(`Failed to create archive: ${error.message}`)
    }
  })

  ipcMain.handle('fs:extractArchive', async (event, archivePath, destPath) => {
    try {
      await decompress(archivePath, destPath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to extract archive: ${error.message}`)
    }
  })
}