import { ipcMain } from 'electron'
import fs from 'fs-extra'
import csvParse from 'csv-parse'
import csvtojson from 'csvtojson'

export function registerCSVHandlers() {
  // Parse CSV data
  ipcMain.handle('csv:parse', async (event, data, options = {}) => {
    try {
      return new Promise((resolve, reject) => {
        csvParse(data, {
          columns: true,
          skip_empty_lines: true,
          ...options
        }, (err, records) => {
          if (err) {
            reject(new Error(`CSV parsing failed: ${err.message}`))
          } else {
            resolve(records)
          }
        })
      })
    } catch (error) {
      throw new Error(`Failed to parse CSV: ${error.message}`)
    }
  })

  // Convert CSV file to JSON
  ipcMain.handle('csv:convertToJSON', async (event, filePath, options = {}) => {
    try {
      const jsonArray = await csvtojson(options).fromFile(filePath)
      return jsonArray
    } catch (error) {
      throw new Error(`Failed to convert CSV to JSON: ${error.message}`)
    }
  })
}