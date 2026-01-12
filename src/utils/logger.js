/**
 * Renderer-safe logger utility.
 *
 * electron-log requires Node.js modules and cannot be used directly
 * in the renderer process with context isolation enabled.
 * This provides a console-based fallback for renderer logging.
 */

/* eslint-disable no-console */
const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => console.debug('[DEBUG]', ...args),
  verbose: (...args) => console.log('[VERBOSE]', ...args),
  silly: (...args) => console.log('[SILLY]', ...args),
};

export default logger;
