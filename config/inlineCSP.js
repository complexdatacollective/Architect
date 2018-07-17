/* eslint-disable no-console */
const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');
const chalk = require('chalk');

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
  let index;

  try {
    index = require.resolve(libName);
  } catch (err) {
    console.error(chalk.red(`Could not resolve module ${libName}, which was expected to provide inline content to the bundle.`));
    console.error(chalk.red('If the module is still included, check that `npm install` is up to date.'));
    console.error(chalk.red('Otherwise, remove the call to `inlineCSP.hash256()`.'));
    throw err;
  }

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

  // Newer versions of plugin contain source directly; older versions export a string
  // TODO: remove legacy parsing above once we're sure it's unneeded
  const clientSource = sandbox.module.exports || source;

  // const cspHash = crypto.createHash('sha256').update(sandbox.module.exports).digest('base64');
  const cspHash = crypto.createHash('sha256').update(clientSource).digest('base64');
  return cspHash;
}

module.exports = {
  hash256,
};
