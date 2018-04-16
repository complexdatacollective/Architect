const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');

/**
 * Hash the final export (assumed to be an inline script) of the given module.
 * This allows use of a [CSP content hash](https://www.w3.org/TR/CSP2/#script-src-hash-usage)
 * to whitelist inlined content loaded in the app.
 *
 * Example:
 * ````
 * inlineCSP.hash256('react-error-overlay')
 * //-> 'srzUm2bR52Dg2g2SqWiGuo719+FqQulMWAYRYJ8hkhc='
 * //
 * // [add to index.html]
 * // <meta http-equiv="Content-Security-Policy" content="default-src 'self';
 * //   script-src 'sha256-srzUm2bR52Dg2g2SqWiGuo719+FqQulMWAYRYJ8hkhc='">
 * ````
 * @param  {string} libName name of module
 * @return {string} base-64 encoded hash of contents
 * @throws {error} If module is not found
 */
function hash256(libName) {
  const index = require.resolve(libName);
  if (!index) { throw new Error(`"${libName}" could not be resolved`); }

  const source = fs.readFileSync(index, 'utf-8');
  const newline = /\n|\r\n|\r/g;
  const matches = source.split(newline).filter(line => line.match(/^module\.exports.*/));

  if (!matches) {
    console.warn('No exports matched');
    return null;
  }

  const exportedSrc = matches[matches.length - 1];
  const sandbox = { module: {} };
  vm.createContext(sandbox);
  vm.runInContext(exportedSrc, sandbox);

  const cspHash = crypto.createHash('sha256').update(sandbox.module.exports).digest('base64');
  return cspHash;
}

module.exports = {
  hash256,
};
