/* eslint-env jest */

const writeFile = jest.fn((filename, content, cb) => cb());
const readFile = jest.fn((filename, cb) => cb(null, 'mock file contents'));
const readdirSync = jest.fn(() => ([]));
const existsSync = jest.fn(() => true);
const createWriteStream = () => {};

export {
  writeFile,
  readFile,
  readdirSync,
  existsSync,
  createWriteStream,
};

export default {
  writeFile,
  readFile,
  readdirSync,
  existsSync,
  createWriteStream,
};
