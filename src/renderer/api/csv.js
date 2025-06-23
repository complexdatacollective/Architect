/**
 * Renderer-side wrapper for CSV operations
 * Provides CSV parsing API using IPC bridge
 */

// Access the exposed API from preload
const { csvAPI } = window;

/**
 * Parse CSV data
 * @param {string} data - CSV data as string
 * @param {Object} options - Parsing options
 * @returns {Promise<Array>} Parsed data
 */
export const parse = (data, options = {}) => 
  csvAPI.parseCSV(data, options);

/**
 * Convert a CSV file to JSON
 * @param {string} filePath - Path to CSV file
 * @param {Object} options - Conversion options
 * @returns {Promise<Array>} JSON data
 */
export const convertToJSON = (filePath, options = {}) => 
  csvAPI.convertCSVToJSON(filePath, options);

/**
 * Parse CSV with headers
 * @param {string} data - CSV data as string
 * @param {Object} options - Additional options
 * @returns {Promise<Array<Object>>} Array of objects with header keys
 */
export const parseWithHeaders = (data, options = {}) => 
  parse(data, { columns: true, ...options });

/**
 * Parse CSV without headers
 * @param {string} data - CSV data as string
 * @param {Object} options - Additional options
 * @returns {Promise<Array<Array>>} Array of arrays
 */
export const parseWithoutHeaders = (data, options = {}) => 
  parse(data, { columns: false, ...options });

/**
 * Convert CSV file to JSON with headers
 * @param {string} filePath - Path to CSV file
 * @param {Object} options - Additional options
 * @returns {Promise<Array<Object>>} Array of objects with header keys
 */
export const fileToJSON = (filePath, options = {}) => 
  convertToJSON(filePath, { columns: true, ...options });

/**
 * Convert CSV file to array of arrays
 * @param {string} filePath - Path to CSV file
 * @param {Object} options - Additional options
 * @returns {Promise<Array<Array>>} Array of arrays
 */
export const fileToArray = (filePath, options = {}) => 
  convertToJSON(filePath, { columns: false, ...options });

// Helper functions

/**
 * Stringify data to CSV format (client-side implementation)
 * @param {Array} data - Array of objects or arrays
 * @param {Object} options - Stringify options
 * @returns {string} CSV string
 */
export const stringify = (data, options = {}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  const {
    columns = null,
    delimiter = ',',
    quote = '"',
    escape = '"',
    header = true,
  } = options;
  
  // Escape a field value
  const escapeField = (field) => {
    if (field == null) return '';
    
    const str = String(field);
    const needsQuotes = str.includes(delimiter) || str.includes(quote) || str.includes('\n');
    
    if (!needsQuotes) return str;
    
    const escaped = str.replace(new RegExp(quote, 'g'), escape + quote);
    return quote + escaped + quote;
  };
  
  let headers;
  let rows;
  
  if (Array.isArray(data[0])) {
    // Array of arrays
    if (columns) {
      headers = columns;
      rows = data;
    } else {
      headers = null;
      rows = data;
    }
  } else {
    // Array of objects
    headers = columns || Object.keys(data[0]);
    rows = data.map(obj => headers.map(key => obj[key]));
  }
  
  const lines = [];
  
  if (header && headers) {
    lines.push(headers.map(escapeField).join(delimiter));
  }
  
  rows.forEach(row => {
    lines.push(row.map(escapeField).join(delimiter));
  });
  
  return lines.join('\n');
};

/**
 * Get CSV headers from data
 * @param {Array} data - CSV data (array of objects or arrays)
 * @returns {Array<string>} Headers
 */
export const getHeaders = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  if (Array.isArray(data[0])) {
    // Assume first row is headers
    return data[0].map(String);
  } else {
    // Object keys are headers
    return Object.keys(data[0]);
  }
};

/**
 * Count rows in CSV data
 * @param {string} data - CSV string
 * @returns {number} Number of rows (excluding header)
 */
export const countRows = (data) => {
  if (!data) return 0;
  
  const lines = data.trim().split('\n');
  // Assume first line is header
  return Math.max(0, lines.length - 1);
};

// Default export with all functions
export default {
  parse,
  convertToJSON,
  parseWithHeaders,
  parseWithoutHeaders,
  fileToJSON,
  fileToArray,
  stringify,
  getHeaders,
  countRows,
};