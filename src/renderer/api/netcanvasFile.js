/**
 * Renderer-side wrapper for netcanvasFile operations
 * Provides the same API as the original netcanvasFile module but using IPC bridge
 */

import { v4 as uuidv4 } from 'uuid';

// Access the exposed APIs from preload
const { fileSystemAPI, dialogAPI, pathAPI, appAPI } = window;

// Error classes matching the original module
export const errors = {
  ReadError: 'ReadError',
  WriteError: 'WriteError',
  OpenFailed: 'OpenFailed',
  CreateFailed: 'CreateFailed',
  SaveFailed: 'SaveFailed',
  MigrationFailed: 'MigrationFailed',
  VerificationFailed: 'VerificationFailed',
  MissingSchemaVersion: 'MissingSchemaVersion',
};

// Schema version states
export const schemaVersionStates = {
  UPGRADE_APP: 'UPGRADE_APP',
  UPGRADE_PROTOCOL: 'UPGRADE_PROTOCOL',
  OK: 'OK',
};

/**
 * Get temporary directory path
 * @param {...string} args - Path segments to join
 * @returns {Promise<string>} Resolves to the created directory path
 */
const getTempDir = async (...args) => {
  const tempPath = await appAPI.getTempPath();
  const dirPath = await pathAPI.join(tempPath, 'architect', ...args);
  await fileSystemAPI.mkdirp(dirPath);
  return dirPath;
};

/**
 * Read protocol from working path
 * @param {string} workingPath - The protocol directory
 * @returns {Promise<object>} The protocol as an object
 */
export const readProtocol = async (workingPath) => {
  const protocolJsonPath = await pathAPI.join(workingPath, 'protocol.json');
  try {
    return await fileSystemAPI.readJson(protocolJsonPath);
  } catch (error) {
    throw new Error(`${errors.ReadError}: ${error.message}`);
  }
};

/**
 * Import a .netcanvas file using the preload API
 * @param {string} filePath - .netcanvas file path
 * @returns {Promise<string>} Working directory path
 */
export const importNetcanvas = async (filePath) => {
  try {
    return await fileSystemAPI.importNetcanvas(filePath);
  } catch (error) {
    throw new Error(`${errors.OpenFailed}: ${error.message}`);
  }
};

/**
 * Create a new .netcanvas file at the target location
 * @param {string} destinationUserPath - Destination path
 * @returns {Promise<string>} Resolves to the save path
 */
export const createNetcanvas = async (destinationUserPath) => {
  try {
    const newDir = await getTempDir('new');
    const workingPath = await pathAPI.join(newDir, uuidv4());
    const assetPath = await pathAPI.join(workingPath, 'assets');
    
    await fileSystemAPI.mkdirp(assetPath);
    
    // Create protocol with template
    const protocol = {
      schemaVersion: 7, // TODO: Import APP_SCHEMA_VERSION from config
      name: 'New Protocol',
      description: '',
      stages: [],
      codebook: {
        ego: {},
        node: {},
        edge: {},
      },
    };
    
    // Save the protocol
    await fileSystemAPI.saveProtocol(workingPath, protocol);
    
    // Export to netcanvas format
    const tempExportPath = await fileSystemAPI.exportNetcanvas(workingPath, null);
    
    // Copy to final destination
    await fileSystemAPI.copy(tempExportPath, destinationUserPath);
    
    return destinationUserPath;
  } catch (error) {
    throw new Error(`${errors.CreateFailed}: ${error.message}`);
  }
};

/**
 * Check schema version of a .netcanvas file
 * @param {string} filePath - .netcanvas file path
 * @param {number} referenceVersion - Reference version (defaults to current app version)
 * @returns {Promise<[number, string]>} [schemaVersion, status]
 */
export const checkSchemaVersion = async (filePath, referenceVersion = 7) => {
  try {
    const workingPath = await importNetcanvas(filePath);
    const protocol = await readProtocol(workingPath);
    
    if (!protocol.schemaVersion) {
      throw new Error(errors.MissingSchemaVersion);
    }
    
    if (referenceVersion === protocol.schemaVersion) {
      return [protocol.schemaVersion, schemaVersionStates.OK];
    }
    
    // For now, we'll implement basic version checking
    // TODO: Implement canUpgrade logic
    if (protocol.schemaVersion < referenceVersion) {
      return [protocol.schemaVersion, schemaVersionStates.UPGRADE_PROTOCOL];
    }
    
    return [protocol.schemaVersion, schemaVersionStates.UPGRADE_APP];
  } catch (error) {
    throw error;
  }
};

/**
 * Validate a netcanvas file
 * @param {string} filePath - .netcanvas file path
 * @returns {Promise<string>} Resolves to filePath if valid
 */
export const validateNetcanvas = async (filePath) => {
  try {
    const workingPath = await importNetcanvas(filePath);
    const protocol = await readProtocol(workingPath);
    
    // Use the validation API
    const isValid = await fileSystemAPI.validateProtocol(protocol);
    if (!isValid) {
      throw new Error('Protocol validation failed');
    }
    
    return filePath;
  } catch (error) {
    throw error;
  }
};

/**
 * Save a protocol to a .netcanvas file
 * @param {string} workingPath - Working directory path
 * @param {object} protocol - Protocol object
 * @param {string} filePath - Destination file path
 * @returns {Promise<string>} Resolves to filePath
 */
export const saveNetcanvas = async (workingPath, protocol, filePath) => {
  try {
    // Add last modified date
    const protocolWithDate = {
      ...protocol,
      lastModified: new Date().toISOString(),
    };
    
    // Save protocol to working directory
    await fileSystemAPI.saveProtocol(workingPath, protocolWithDate);
    
    // Export to netcanvas format
    const tempExportPath = await fileSystemAPI.exportNetcanvas(workingPath, null);
    
    // Create backup if file exists
    const fileExists = await fileSystemAPI.pathExists(filePath);
    let backupPath = null;
    
    if (fileExists) {
      const parsed = await pathAPI.parse(filePath);
      backupPath = await pathAPI.join(
        parsed.dir,
        `${parsed.name}.backup-${new Date().getTime()}${parsed.ext}`
      );
      await fileSystemAPI.rename(filePath, backupPath);
    }
    
    try {
      // Copy export to final destination
      await fileSystemAPI.copy(tempExportPath, filePath);
      
      // Remove backup if successful
      if (backupPath) {
        await fileSystemAPI.unlink(backupPath);
      }
      
      return filePath;
    } catch (error) {
      // Restore backup on failure
      if (backupPath) {
        await fileSystemAPI.rename(backupPath, filePath);
      }
      throw error;
    }
  } catch (error) {
    throw new Error(`${errors.SaveFailed}: ${error.message}`);
  }
};

/**
 * Migrate a .netcanvas file to a new schema version
 * @param {string} filePath - Source file path
 * @param {string} newFilePath - Destination file path
 * @param {number} targetVersion - Target schema version
 * @returns {Promise<string>} Resolves to newFilePath
 */
export const migrateNetcanvas = async (filePath, newFilePath, targetVersion = 7) => {
  try {
    const workingPath = await importNetcanvas(filePath);
    const protocol = await readProtocol(workingPath);
    
    // TODO: Implement actual migration logic
    // For now, just update the schema version
    const updatedProtocol = {
      ...protocol,
      schemaVersion: targetVersion,
    };
    
    return await saveNetcanvas(workingPath, updatedProtocol, newFilePath);
  } catch (error) {
    throw new Error(`${errors.MigrationFailed}: ${error.message}`);
  }
};

/**
 * Get a new filename for saving
 * @param {string} filePath - Original file path
 * @returns {Promise<string>} New file path from save dialog
 */
export const getNewFileName = async (filePath) => {
  const basename = await pathAPI.basename(filePath, '.netcanvas');
  
  const result = await dialogAPI.showSaveDialog({
    buttonLabel: 'Save',
    defaultPath: `${basename} (schema version 7).netcanvas`,
    filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  });
  
  return result.canceled ? null : result.filePath;
};