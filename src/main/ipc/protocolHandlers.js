import { ipcMain, app } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import decompress from 'decompress'
import archiver from 'archiver'

// Protocol-specific operations
export function registerProtocolHandlers() {
  // Import a .netcanvas file to a working directory
  ipcMain.handle('fs:importNetcanvas', async (event, filePath) => {
    try {
      const tempPath = app.getPath('temp')
      const workingPath = path.join(tempPath, 'architect', uuidv4())
      
      // Create working directory
      await fs.mkdirp(workingPath)
      
      // Extract the .netcanvas file (which is a zip)
      await decompress(filePath, workingPath)
      
      return workingPath
    } catch (error) {
      throw new Error(`Failed to import netcanvas file: ${error.message}`)
    }
  })

  // Export a working directory to a .netcanvas file
  ipcMain.handle('fs:exportNetcanvas', async (event, workingPath, outputPath) => {
    try {
      return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath)
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', () => {
          resolve({ success: true, size: archive.pointer() })
        })

        archive.on('error', (err) => {
          reject(new Error(`Export failed: ${err.message}`))
        })

        archive.pipe(output)
        
        // Add protocol.json
        const protocolPath = path.join(workingPath, 'protocol.json')
        if (fs.existsSync(protocolPath)) {
          archive.file(protocolPath, { name: 'protocol.json' })
        }
        
        // Add assets directory if it exists
        const assetsPath = path.join(workingPath, 'assets')
        if (fs.existsSync(assetsPath)) {
          archive.directory(assetsPath, 'assets')
        }
        
        archive.finalize()
      })
    } catch (error) {
      throw new Error(`Failed to export netcanvas file: ${error.message}`)
    }
  })

  // Load protocol from working directory
  ipcMain.handle('fs:loadProtocol', async (event, workingPath) => {
    try {
      const protocolPath = path.join(workingPath, 'protocol.json')
      const protocol = await fs.readJson(protocolPath)
      return protocol
    } catch (error) {
      throw new Error(`Failed to load protocol: ${error.message}`)
    }
  })

  // Save protocol to working directory
  ipcMain.handle('fs:saveProtocol', async (event, workingPath, protocolData) => {
    try {
      const protocolPath = path.join(workingPath, 'protocol.json')
      await fs.writeJson(protocolPath, protocolData, { spaces: 2 })
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to save protocol: ${error.message}`)
    }
  })

  // Asset operations
  ipcMain.handle('fs:loadAsset', async (event, assetPath) => {
    try {
      const data = await fs.readFile(assetPath)
      return data
    } catch (error) {
      throw new Error(`Failed to load asset: ${error.message}`)
    }
  })

  ipcMain.handle('fs:saveAsset', async (event, assetPath, data) => {
    try {
      await fs.writeFile(assetPath, data)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to save asset: ${error.message}`)
    }
  })

  ipcMain.handle('fs:importAsset', async (event, sourcePath, destPath) => {
    try {
      await fs.copy(sourcePath, destPath)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to import asset: ${error.message}`)
    }
  })

  // Protocol validation (placeholder - implement actual validation logic)
  ipcMain.handle('fs:validateProtocol', async (event, protocolData) => {
    try {
      // TODO: Implement actual protocol validation using @codaco/protocol-validation
      // For now, just check if it has required fields
      if (!protocolData.name || !protocolData.stages) {
        throw new Error('Invalid protocol structure')
      }
      
      return { 
        valid: true, 
        errors: [] 
      }
    } catch (error) {
      return { 
        valid: false, 
        errors: [error.message] 
      }
    }
  })
}