/**
 * Renderer-side wrapper for app operations
 * Provides electron app API using IPC bridge
 */

// Access the exposed APIs from preload
const { appAPI, electronAPI } = window;

/**
 * Get a system directory path
 * @param {string} name - Directory name (home, appData, userData, temp, etc.)
 * @returns {Promise<string>} Directory path
 */
export const getPath = (name) => 
  appAPI.getPath(name);

/**
 * Get the application's directory path
 * @returns {Promise<string>} App directory path
 */
export const getAppPath = () => 
  appAPI.getAppPath();

/**
 * Get the system temp directory path
 * @returns {Promise<string>} Temp directory path
 */
export const getTempPath = () => 
  appAPI.getTempPath();

/**
 * Get the app version
 * @returns {Promise<string>} App version
 */
export const getVersion = () => 
  electronAPI.getVersion();

/**
 * Quit the application
 */
export const quit = () => 
  electronAPI.quit();

// Platform and version info (synchronous)
export const platform = () => electronAPI.platform;
export const versions = electronAPI.versions;

// Helper functions for common paths

/**
 * Get the user data directory
 * @returns {Promise<string>} User data directory path
 */
export const getUserDataPath = () => 
  getPath('userData');

/**
 * Get the documents directory
 * @returns {Promise<string>} Documents directory path
 */
export const getDocumentsPath = () => 
  getPath('documents');

/**
 * Get the downloads directory
 * @returns {Promise<string>} Downloads directory path
 */
export const getDownloadsPath = () => 
  getPath('downloads');

/**
 * Get the desktop directory
 * @returns {Promise<string>} Desktop directory path
 */
export const getDesktopPath = () => 
  getPath('desktop');

/**
 * Get the home directory
 * @returns {Promise<string>} Home directory path
 */
export const getHomePath = () => 
  getPath('home');

/**
 * Check if running on macOS
 * @returns {boolean}
 */
export const isMac = () => 
  electronAPI.platform === 'darwin';

/**
 * Check if running on Windows
 * @returns {boolean}
 */
export const isWindows = () => 
  electronAPI.platform === 'win32';

/**
 * Check if running on Linux
 * @returns {boolean}
 */
export const isLinux = () => 
  electronAPI.platform === 'linux';

// Default export with all functions
export default {
  getPath,
  getAppPath,
  getTempPath,
  getVersion,
  quit,
  platform,
  versions,
  getUserDataPath,
  getDocumentsPath,
  getDownloadsPath,
  getDesktopPath,
  getHomePath,
  isMac,
  isWindows,
  isLinux,
};