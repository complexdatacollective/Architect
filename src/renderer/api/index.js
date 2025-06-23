/**
 * Renderer API - Main entry point
 * Provides a clean interface for renderer code to use instead of direct Node.js module calls
 * All APIs use the IPC bridge exposed through the preload script
 */

// Import all API modules
import * as fileSystem from './fileSystem';
import * as dialog from './dialog';
import * as path from './path';
import * as app from './app';
import * as shell from './shell';
import * as csv from './csv';
import * as netcanvasFile from './netcanvasFile';

// Re-export all APIs
export {
  fileSystem,
  dialog,
  path,
  app,
  shell,
  csv,
  netcanvasFile,
};

// Also export common functions directly for convenience
export {
  // File system operations
  readFile,
  writeFile,
  readJson,
  writeJson,
  readdir,
  mkdir,
  mkdirp,
  copy,
  rename,
  unlink,
  remove,
  stat,
  pathExists,
  access,
} from './fileSystem';

export {
  // Dialog operations
  showOpenDialog,
  showSaveDialog,
  showMessageBox,
  showErrorBox,
  confirm,
  alert,
  warning,
  error,
  openFile,
  openDirectory,
  saveFile,
} from './dialog';

export {
  // Path operations
  join,
  basename,
  dirname,
  extname,
  parse,
  normalize,
  resolve,
  relative,
} from './path';

export {
  // App operations
  getPath,
  getAppPath,
  getTempPath,
  getVersion,
  quit,
  platform,
  versions,
} from './app';

export {
  // Shell operations
  openExternal,
  showItemInFolder,
  openEmail,
  openPath,
} from './shell';

export {
  // CSV operations
  parseCSV,
  convertCSVToJSON,
  parseWithHeaders,
  fileToJSON,
} from './csv';

export {
  // NetCanvas file operations
  readProtocol,
  importNetcanvas,
  createNetcanvas,
  checkSchemaVersion,
  validateNetcanvas,
  saveNetcanvas,
  migrateNetcanvas,
  getNewFileName,
  errors as netcanvasErrors,
  schemaVersionStates,
} from './netcanvasFile';

// Default export with all modules
export default {
  fileSystem,
  dialog,
  path,
  app,
  shell,
  csv,
  netcanvasFile,
};