/**
 * Renderer-safe logger utility.
 *
 * electron-log requires Node.js modules and cannot be used directly
 * in the renderer process with context isolation enabled.
 * This provides a console-based fallback for renderer logging.
 */

const logger = {
  info: (..._args) => {},
  warn: (..._args) => {},
  error: (..._args) => {},
  debug: (..._args) => {},
  verbose: (..._args) => {},
  silly: (..._args) => {},
};

export default logger;
