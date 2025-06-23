/**
 * Renderer-side wrapper for shell operations
 * Provides electron shell API using IPC bridge
 */

// Access the exposed API from preload
const { shellAPI } = window;

/**
 * Open a URL in the default browser
 * @param {string} url - URL to open
 * @returns {Promise<void>}
 */
export const openExternal = (url) => 
  shellAPI.openExternal(url);

/**
 * Show a file in the file manager
 * @param {string} path - File path to show
 * @returns {Promise<void>}
 */
export const showItemInFolder = (path) => 
  shellAPI.showItemInFolder(path);

// Helper functions

/**
 * Open an email link
 * @param {string} email - Email address
 * @param {Object} options - Email options (subject, body)
 * @returns {Promise<void>}
 */
export const openEmail = (email, options = {}) => {
  const { subject, body } = options;
  let mailto = `mailto:${email}`;
  
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    mailto += `?${params.join('&')}`;
  }
  
  return openExternal(mailto);
};

/**
 * Open a file with the default application
 * @param {string} filePath - File path to open
 * @returns {Promise<void>}
 */
export const openPath = (filePath) => 
  openExternal(`file://${filePath}`);

/**
 * Check if a URL is safe to open
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is safe
 */
export const isSafeUrl = (url) => {
  try {
    const parsed = new URL(url);
    const safeProtocols = ['http:', 'https:', 'mailto:', 'file:'];
    return safeProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Open a URL if it's safe
 * @param {string} url - URL to open
 * @returns {Promise<boolean>} True if opened, false if unsafe
 */
export const openExternalSafe = async (url) => {
  if (isSafeUrl(url)) {
    await openExternal(url);
    return true;
  }
  return false;
};

// Default export with all functions
export default {
  openExternal,
  showItemInFolder,
  openEmail,
  openPath,
  isSafeUrl,
  openExternalSafe,
};