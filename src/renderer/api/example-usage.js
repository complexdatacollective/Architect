/**
 * Example usage of the renderer API
 * This file demonstrates how to use the API wrappers in actual renderer code
 */

import {
  fileSystem,
  dialog,
  path,
  app,
  shell,
  csv,
  netcanvasFile,
} from './index';

// Example 1: Working with protocol files
async function openProtocol() {
  try {
    // Show file picker
    const filePath = await dialog.openFile({
      filters: [{ name: 'Network Canvas Protocol', extensions: ['netcanvas'] }],
      title: 'Open Protocol',
    });
    
    if (!filePath) return null;
    
    // Check schema version
    const [version, status] = await netcanvasFile.checkSchemaVersion(filePath);
    
    if (status === netcanvasFile.schemaVersionStates.UPGRADE_PROTOCOL) {
      const shouldUpgrade = await dialog.confirm(
        'Protocol Update Required',
        `This protocol uses schema version ${version}. Would you like to update it?`
      );
      
      if (shouldUpgrade) {
        const newPath = await dialog.saveFile({
          filters: [{ name: 'Network Canvas Protocol', extensions: ['netcanvas'] }],
          defaultPath: await path.basename(filePath, '.netcanvas') + '_updated.netcanvas',
        });
        
        if (newPath) {
          await netcanvasFile.migrateNetcanvas(filePath, newPath);
          filePath = newPath;
        }
      }
    }
    
    // Import the protocol
    const workingPath = await netcanvasFile.importNetcanvas(filePath);
    const protocol = await netcanvasFile.readProtocol(workingPath);
    
    return { workingPath, protocol, filePath };
  } catch (error) {
    await dialog.error('Failed to open protocol', error.message);
    throw error;
  }
}

// Example 2: Saving a protocol
async function saveProtocol(workingPath, protocol, currentPath) {
  try {
    const savePath = currentPath || await dialog.saveFile({
      filters: [{ name: 'Network Canvas Protocol', extensions: ['netcanvas'] }],
      defaultPath: protocol.name + '.netcanvas',
    });
    
    if (!savePath) return null;
    
    await netcanvasFile.saveNetcanvas(workingPath, protocol, savePath);
    
    await dialog.alert('Protocol Saved', `Protocol saved successfully to ${await path.basename(savePath)}`);
    
    return savePath;
  } catch (error) {
    await dialog.error('Failed to save protocol', error.message);
    throw error;
  }
}

// Example 3: Working with assets
async function importAsset(type = 'image') {
  try {
    const filters = {
      image: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'] }],
      audio: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'm4a'] }],
      video: [{ name: 'Video', extensions: ['mp4', 'webm', 'mov'] }],
    };
    
    const assetPath = await dialog.openFile({
      filters: filters[type] || [],
      title: `Import ${type}`,
    });
    
    if (!assetPath) return null;
    
    // Get asset info
    const stats = await fileSystem.stat(assetPath);
    const name = await path.basename(assetPath);
    const ext = await path.extname(assetPath);
    
    // Copy to assets directory
    const destDir = await path.join(await app.getUserDataPath(), 'assets', type);
    await fileSystem.mkdirp(destDir);
    
    const destPath = await path.join(destDir, `${Date.now()}_${name}`);
    await fileSystem.copy(assetPath, destPath);
    
    return {
      name,
      path: destPath,
      type,
      size: stats.size,
      extension: ext,
    };
  } catch (error) {
    await dialog.error(`Failed to import ${type}`, error.message);
    throw error;
  }
}

// Example 4: Working with CSV data
async function importCSVData() {
  try {
    const csvPath = await dialog.openFile({
      filters: [{ name: 'CSV Files', extensions: ['csv'] }],
      title: 'Import CSV Data',
    });
    
    if (!csvPath) return null;
    
    // Parse CSV with headers
    const data = await csv.fileToJSON(csvPath);
    
    if (data.length === 0) {
      await dialog.warning('No Data', 'The CSV file appears to be empty.');
      return null;
    }
    
    // Show preview
    const headers = csv.getHeaders(data);
    await dialog.alert(
      'CSV Import',
      `Imported ${data.length} rows with columns: ${headers.join(', ')}`
    );
    
    return data;
  } catch (error) {
    await dialog.error('Failed to import CSV', error.message);
    throw error;
  }
}

// Example 5: System integration
async function showProtocolInFolder(protocolPath) {
  try {
    if (!protocolPath) return;
    
    const exists = await fileSystem.pathExists(protocolPath);
    if (!exists) {
      await dialog.warning('File Not Found', 'The protocol file no longer exists.');
      return;
    }
    
    await shell.showItemInFolder(protocolPath);
  } catch (error) {
    await dialog.error('Failed to show file', error.message);
  }
}

// Example 6: Creating a new protocol
async function createNewProtocol() {
  try {
    const savePath = await dialog.saveFile({
      filters: [{ name: 'Network Canvas Protocol', extensions: ['netcanvas'] }],
      defaultPath: 'New Protocol.netcanvas',
      title: 'Create New Protocol',
    });
    
    if (!savePath) return null;
    
    await netcanvasFile.createNetcanvas(savePath);
    
    // Import the newly created protocol
    const workingPath = await netcanvasFile.importNetcanvas(savePath);
    const protocol = await netcanvasFile.readProtocol(workingPath);
    
    return { workingPath, protocol, filePath: savePath };
  } catch (error) {
    await dialog.error('Failed to create protocol', error.message);
    throw error;
  }
}

// Export example functions for use
export {
  openProtocol,
  saveProtocol,
  importAsset,
  importCSVData,
  showProtocolInFolder,
  createNewProtocol,
};