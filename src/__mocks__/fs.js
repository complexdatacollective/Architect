/* eslint-env jest */

const writeFile = jest.fn((filename, content, cb) => cb());
const readFile = jest.fn((filename, cb) => cb(null, 'mock file contents'));
const readdirSync = jest.fn(() => ([]));

export {
  writeFile,
  readFile,
  readdirSync,
};

export default {
  writeFile,
  readFile,
  readdirSync,
};
