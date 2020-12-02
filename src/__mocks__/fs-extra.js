/* eslint-env jest */

// TODO: error/reject by default!

const callbackOrPromise = (...args) => {
  const lastArg = args[args.length - 1];
  if (typeof lastArg === 'function') {
    lastArg(null, 'mock file contents');
    return null;
  }
  return Promise.resolve();
};

export const access = jest.fn(() => Promise.resolve());
export const copy = jest.fn(() => Promise.resolve());
export const copySync = jest.fn();
export const createWriteStream = () => {};
export const emptyDirSync = jest.fn();
export const existsSync = jest.fn(() => true);
export const mkdirp = jest.fn(() => Promise.resolve());
export const pathExists = jest.fn(() => Promise.reject());
export const readdir = jest.fn(() => Promise.resolve([]));
export const readdirSync = jest.fn(() => ([]));
export const readFile = jest.fn(callbackOrPromise);
export const readJson = jest.fn(() => Promise.resolve());
export const rename = jest.fn(() => Promise.resolve());
export const stat = jest.fn(() => ({
  isFile: () => Promise.reject(new Error('stat.isFile')),
}));
export const writeFile = jest.fn((filename, content, cb) => cb());
export const writeJson = jest.fn(() => Promise.reject(new Error('mock writeJson')));
export const unlink = jest.fn(() => Promise.reject(new Error('mock unlink')));

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
  mkdirp,
  pathExists,
  readdir,
  readdirSync,
  readFile,
  readJson,
  rename,
  stat,
  writeFile,
  writeJson,
  unlink,
};
