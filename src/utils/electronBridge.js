/**
 * Electron Bridge - Abstraction layer for accessing Electron APIs from renderer.
 *
 * This module provides a consistent API that:
 * 1. Uses window.electronAPI (exposed via preload) when running in Electron
 * 2. Throws helpful errors when APIs are not available (e.g., in tests)
 * 3. Can be easily mocked for testing
 *
 * Usage:
 *   import { electronAPI } from '@utils/electronBridge';
 *   const tempPath = await electronAPI.app.getPath('temp');
 */

const isElectron = () => typeof window !== 'undefined' && window.electronAPI;

/**
 * Creates a proxy that throws helpful errors for missing APIs
 */
const createApiProxy = (namespace, methods) => {
  const proxy = {};
  methods.forEach((method) => {
    proxy[method] = async (...args) => {
      if (!isElectron()) {
        throw new Error(
          `electronAPI.${namespace}.${method} is not available. `
          + 'Are you running in Electron with the preload script loaded?',
        );
      }
      return window.electronAPI[namespace][method](...args);
    };
  });
  return proxy;
};

/**
 * IPC communication methods
 */
const ipc = {
  send: (channel, ...args) => {
    if (isElectron()) {
      window.electronAPI.ipc.send(channel, ...args);
    }
  },
  on: (channel, callback) => {
    if (isElectron()) {
      return window.electronAPI.ipc.on(channel, callback);
    }
    return () => {}; // Return no-op cleanup function
  },
  once: (channel, callback) => {
    if (isElectron()) {
      window.electronAPI.ipc.once(channel, callback);
    }
  },
  removeAllListeners: (channel) => {
    if (isElectron()) {
      window.electronAPI.ipc.removeAllListeners(channel);
    }
  },
};

/**
 * Dialog methods
 */
const dialog = createApiProxy('dialog', [
  'showOpenDialog',
  'showSaveDialog',
  'showMessageBox',
]);

/**
 * App info methods
 */
const app = {
  getPath: async (name) => {
    if (!isElectron()) {
      throw new Error('electronAPI.app.getPath is not available');
    }
    return window.electronAPI.app.getPath(name);
  },
  getAppPath: async () => {
    if (!isElectron()) {
      throw new Error('electronAPI.app.getAppPath is not available');
    }
    return window.electronAPI.app.getAppPath();
  },
  getVersion: async () => {
    if (!isElectron()) {
      return '0.0.0-test'; // Return test version when not in Electron
    }
    return window.electronAPI.app.getVersion();
  },
};

/**
 * File system methods
 */
const fs = createApiProxy('fs', [
  'readJson',
  'writeJson',
  'readFile',
  'writeFile',
  'copy',
  'unlink',
  'remove',
  'rename',
  'access',
  'stat',
  'mkdirp',
  'pathExists',
  'readdir',
  'outputFile',
]);

/**
 * Path methods
 */
const pathUtils = createApiProxy('path', [
  'join',
  'basename',
  'dirname',
  'extname',
  'parse',
  'resolve',
  'normalize',
  'relative',
]);

/**
 * Archive methods
 */
const archive = createApiProxy('archive', [
  'create',
  'extract',
]);

/**
 * Shell methods
 */
const shell = createApiProxy('shell', [
  'openExternal',
  'openPath',
]);

/**
 * Window methods
 */
const windowApi = createApiProxy('window', [
  'hide',
  'show',
  'close',
]);

/**
 * WebContents methods
 */
const webContents = createApiProxy('webContents', [
  'printToPDF',
]);

/**
 * Platform info
 */
const getPlatform = () => {
  if (isElectron()) {
    return window.electronAPI.platform;
  }
  return 'unknown';
};

/**
 * Main export - the electronAPI object that mirrors window.electronAPI
 * but with error handling and test support
 */
export const electronAPI = {
  ipc,
  dialog,
  app,
  fs,
  path: pathUtils,
  archive,
  shell,
  window: windowApi,
  webContents,
  platform: getPlatform(),
  isElectron,
};

/**
 * Synchronous path utilities for simple operations that don't need IPC
 * These work in the renderer without async calls
 */
export const pathSync = {
  join: (...args) => {
    const parts = args
      .filter((arg) => arg != null && arg !== '')
      .map((arg) => String(arg).replace(/\\/g, '/'));

    if (parts.length === 0) return '.';

    let joined = parts.join('/');
    // Normalize multiple slashes but preserve leading //
    joined = joined.replace(/\/+/g, '/');
    // Remove trailing slash unless it's the root
    if (joined.length > 1 && joined.endsWith('/')) {
      joined = joined.slice(0, -1);
    }
    return joined;
  },
  basename: (filePath, ext) => {
    if (!filePath) return '';
    const parts = filePath.replace(/\\/g, '/').split('/');
    let base = parts[parts.length - 1] || parts[parts.length - 2] || '';
    if (ext && base.endsWith(ext)) {
      base = base.slice(0, -ext.length);
    }
    return base;
  },
  dirname: (filePath) => {
    if (!filePath) return '.';
    const normalized = filePath.replace(/\\/g, '/');
    const lastSlash = normalized.lastIndexOf('/');
    if (lastSlash === -1) return '.';
    if (lastSlash === 0) return '/';
    return normalized.slice(0, lastSlash);
  },
  extname: (filePath) => {
    if (!filePath) return '';
    const base = pathSync.basename(filePath);
    const dotIndex = base.lastIndexOf('.');
    if (dotIndex === -1 || dotIndex === 0) return '';
    return base.slice(dotIndex);
  },
  parse: (filePath) => {
    const base = pathSync.basename(filePath);
    const ext = pathSync.extname(filePath);
    const name = ext ? base.slice(0, -ext.length) : base;
    return {
      root: filePath.startsWith('/') ? '/' : '',
      dir: pathSync.dirname(filePath),
      base,
      ext,
      name,
    };
  },
};

/**
 * Re-export individual namespaces for convenience
 */
export {
  ipc,
  dialog,
  app,
  fs,
  pathUtils as path,
  archive,
  shell,
  windowApi as window,
  webContents,
  getPlatform,
  isElectron,
};

export default electronAPI;
