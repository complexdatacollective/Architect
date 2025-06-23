/**
 * Renderer-side wrapper for dialog operations
 * Provides electron dialog API using IPC bridge
 */

// Access the exposed API from preload
const { dialogAPI } = window;

/**
 * Show an open dialog
 * @param {Object} options - Dialog options
 * @returns {Promise<{canceled: boolean, filePaths: string[]}>}
 */
export const showOpenDialog = (options = {}) => 
  dialogAPI.showOpenDialog(options);

/**
 * Show a save dialog
 * @param {Object} options - Dialog options
 * @returns {Promise<{canceled: boolean, filePath: string}>}
 */
export const showSaveDialog = (options = {}) => 
  dialogAPI.showSaveDialog(options);

/**
 * Show a message box
 * @param {Object} options - Message box options
 * @returns {Promise<{response: number, checkboxChecked: boolean}>}
 */
export const showMessageBox = (options = {}) => 
  dialogAPI.showMessageBox(options);

/**
 * Show an error box
 * @param {string} title - Error title
 * @param {string} content - Error content
 * @returns {Promise<void>}
 */
export const showErrorBox = (title, content) => 
  dialogAPI.showErrorBox(title, content);

// Helper functions for common dialog patterns

/**
 * Show a confirmation dialog
 * @param {string} message - Message to display
 * @param {string} detail - Additional detail
 * @returns {Promise<boolean>} True if user clicked "Yes"
 */
export const confirm = async (message, detail = '') => {
  const result = await showMessageBox({
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 0,
    message,
    detail,
  });
  return result.response === 0;
};

/**
 * Show an alert dialog
 * @param {string} message - Message to display
 * @param {string} detail - Additional detail
 * @returns {Promise<void>}
 */
export const alert = async (message, detail = '') => {
  await showMessageBox({
    type: 'info',
    buttons: ['OK'],
    message,
    detail,
  });
};

/**
 * Show a warning dialog
 * @param {string} message - Message to display
 * @param {string} detail - Additional detail
 * @returns {Promise<void>}
 */
export const warning = async (message, detail = '') => {
  await showMessageBox({
    type: 'warning',
    buttons: ['OK'],
    message,
    detail,
  });
};

/**
 * Show an error dialog
 * @param {string} message - Error message
 * @param {string} detail - Error detail
 * @returns {Promise<void>}
 */
export const error = async (message, detail = '') => {
  await showMessageBox({
    type: 'error',
    buttons: ['OK'],
    message,
    detail,
  });
};

/**
 * Show a file picker dialog
 * @param {Object} options - Additional options
 * @returns {Promise<string|null>} Selected file path or null if canceled
 */
export const openFile = async (options = {}) => {
  const result = await showOpenDialog({
    properties: ['openFile'],
    ...options,
  });
  return result.canceled ? null : result.filePaths[0];
};

/**
 * Show a directory picker dialog
 * @param {Object} options - Additional options
 * @returns {Promise<string|null>} Selected directory path or null if canceled
 */
export const openDirectory = async (options = {}) => {
  const result = await showOpenDialog({
    properties: ['openDirectory'],
    ...options,
  });
  return result.canceled ? null : result.filePaths[0];
};

/**
 * Show a save file dialog
 * @param {Object} options - Additional options
 * @returns {Promise<string|null>} Save file path or null if canceled
 */
export const saveFile = async (options = {}) => {
  const result = await showSaveDialog(options);
  return result.canceled ? null : result.filePath;
};

// Default export with all functions
export default {
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
};