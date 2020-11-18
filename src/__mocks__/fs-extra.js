/* eslint-env jest */

export const copySync = jest.fn();
export const emptyDirSync = jest.fn();
export const readJson = jest.fn(() => Promise.resolve());
export const readFile = jest.fn((...args) => {
  const lastArg = args[args.length - 1];
  if (typeof lastArg === 'function') {
    lastArg(null, 'mock file contents');
    return null;
  }
  return Promise.resolve();
});
export const writeFile = jest.fn((filename, content, cb) => cb());
export const readdirSync = jest.fn(() => ([]));
export const existsSync = jest.fn(() => true);
export const createWriteStream = () => {};
export const access = jest.fn(() => Promise.resolve());
export const copy = jest.fn(() => Promise.resolve());
export const rename = jest.fn(() => Promise.resolve());
export const mkdirp = jest.fn(() => Promise.resolve());

export const constants = {
  R_OK: Symbol('R_OK'),
};

export default {
  access,
  constants,
  copy,
  copySync,
  createWriteStream,
  emptyDirSync,
  existsSync,
  readdirSync,
  readFile,
  readJson,
  rename,
  writeFile,
  mkdirp,
};
