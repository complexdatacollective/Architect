/**
 * Renderer-side wrapper for file system operations
 * Provides fs-extra compatible API using IPC bridge
 */

// Access the exposed API from preload
const { fileSystemAPI } = window;

// File operations
export const readFile = (filePath, encoding = 'utf8') => 
  fileSystemAPI.readFile(filePath, encoding);

export const writeFile = (filePath, data, encoding = 'utf8') => 
  fileSystemAPI.writeFile(filePath, data, encoding);

export const readJson = (filePath) => 
  fileSystemAPI.readJson(filePath);

export const writeJson = (filePath, data, options = { spaces: 2 }) => 
  fileSystemAPI.writeJson(filePath, data);

export const readJSON = readJson; // Alias for compatibility
export const writeJSON = writeJson; // Alias for compatibility

// Directory operations
export const readdir = (dirPath) => 
  fileSystemAPI.readdir(dirPath);

export const mkdir = (dirPath) => 
  fileSystemAPI.mkdir(dirPath);

export const mkdirp = (dirPath) => 
  fileSystemAPI.mkdirp(dirPath);

export const ensureDir = mkdirp; // Alias for compatibility
export const mkdirs = mkdirp; // Alias for compatibility

// File management
export const copy = (src, dest) => 
  fileSystemAPI.copy(src, dest);

export const rename = (oldPath, newPath) => 
  fileSystemAPI.rename(oldPath, newPath);

export const move = rename; // Alias for compatibility

export const unlink = (filePath) => 
  fileSystemAPI.unlink(filePath);

export const remove = (path) => 
  fileSystemAPI.remove(path);

// File info
export const stat = (path) => 
  fileSystemAPI.stat(path);

export const pathExists = (path) => 
  fileSystemAPI.pathExists(path);

export const exists = pathExists; // Alias for compatibility

export const access = (path, mode) => 
  fileSystemAPI.access(path, mode);

// Constants for access mode
export const constants = {
  F_OK: 0, // File exists
  R_OK: 4, // File is readable
  W_OK: 2, // File is writable
  X_OK: 1, // File is executable
};

// Archive operations
export const createArchive = (sourcePath, destPath) => 
  fileSystemAPI.createArchive(sourcePath, destPath);

export const extractArchive = (archivePath, destPath) => 
  fileSystemAPI.extractArchive(archivePath, destPath);

// Default export with all functions
export default {
  readFile,
  writeFile,
  readJson,
  writeJson,
  readJSON,
  writeJSON,
  readdir,
  mkdir,
  mkdirp,
  ensureDir,
  mkdirs,
  copy,
  rename,
  move,
  unlink,
  remove,
  stat,
  pathExists,
  exists,
  access,
  constants,
  createArchive,
  extractArchive,
};