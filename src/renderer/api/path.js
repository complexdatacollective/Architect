/**
 * Renderer-side wrapper for path operations
 * Provides Node.js path API using IPC bridge
 */

// Access the exposed API from preload
const { pathAPI } = window;

/**
 * Join path segments
 * @param {...string} paths - Path segments to join
 * @returns {Promise<string>} Joined path
 */
export const join = (...paths) => 
  pathAPI.join(...paths);

/**
 * Get the last portion of a path
 * @param {string} path - Path string
 * @param {string} ext - Optional extension to remove
 * @returns {Promise<string>} Base name
 */
export const basename = (path, ext) => 
  pathAPI.basename(path, ext);

/**
 * Get the directory name of a path
 * @param {string} path - Path string
 * @returns {Promise<string>} Directory name
 */
export const dirname = (path) => 
  pathAPI.dirname(path);

/**
 * Get the extension of a path
 * @param {string} path - Path string
 * @returns {Promise<string>} Extension including the dot
 */
export const extname = (path) => 
  pathAPI.extname(path);

/**
 * Parse a path into its components
 * @param {string} path - Path string
 * @returns {Promise<{root: string, dir: string, base: string, ext: string, name: string}>}
 */
export const parse = (path) => 
  pathAPI.parse(path);

/**
 * Normalize a path
 * @param {string} path - Path string
 * @returns {Promise<string>} Normalized path
 */
export const normalize = (path) => 
  pathAPI.normalize(path);

// Path constants
export const sep = process.platform === 'win32' ? '\\' : '/';
export const delimiter = process.platform === 'win32' ? ';' : ':';

// Helper functions

/**
 * Check if a path is absolute
 * @param {string} path - Path to check
 * @returns {boolean} True if absolute
 */
export const isAbsolute = (path) => {
  if (process.platform === 'win32') {
    return /^[a-zA-Z]:/.test(path) || path.startsWith('\\\\');
  }
  return path.startsWith('/');
};

/**
 * Resolve a sequence of paths into an absolute path
 * @param {...string} paths - Path segments
 * @returns {Promise<string>} Resolved absolute path
 */
export const resolve = async (...paths) => {
  // This is a simplified implementation
  // In a real scenario, you might need to implement this on the main process
  if (paths.length === 0) return process.cwd();
  
  let resolvedPath = '';
  for (let i = paths.length - 1; i >= 0; i--) {
    const segment = paths[i];
    if (!segment) continue;
    
    resolvedPath = segment + (resolvedPath ? sep + resolvedPath : '');
    
    if (isAbsolute(segment)) {
      break;
    }
  }
  
  return normalize(resolvedPath);
};

/**
 * Get the relative path from one path to another
 * @param {string} from - Source path
 * @param {string} to - Destination path
 * @returns {Promise<string>} Relative path
 */
export const relative = async (from, to) => {
  // This is a simplified implementation
  // In a real scenario, you might need to implement this on the main process
  const fromParts = from.split(sep).filter(Boolean);
  const toParts = to.split(sep).filter(Boolean);
  
  let common = 0;
  for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
    if (fromParts[i] !== toParts[i]) break;
    common++;
  }
  
  const upCount = fromParts.length - common;
  const relativeParts = [];
  
  for (let i = 0; i < upCount; i++) {
    relativeParts.push('..');
  }
  
  relativeParts.push(...toParts.slice(common));
  
  return relativeParts.join(sep) || '.';
};

/**
 * Format a path object into a path string
 * @param {Object} pathObject - Path object with dir, root, base, name, ext
 * @returns {string} Formatted path
 */
export const format = (pathObject) => {
  const { dir, root, base, name, ext } = pathObject;
  
  if (base) {
    return dir ? join(dir, base) : base;
  }
  
  const fileName = name + (ext || '');
  if (dir) {
    return join(dir, fileName);
  }
  
  return root ? join(root, fileName) : fileName;
};

// Default export with all functions
export default {
  join,
  basename,
  dirname,
  extname,
  parse,
  normalize,
  sep,
  delimiter,
  isAbsolute,
  resolve,
  relative,
  format,
};