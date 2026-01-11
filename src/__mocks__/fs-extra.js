import { vi } from 'vitest';

// TODO: error/reject by default!

const callbackOrPromise = (...args) => {
  const lastArg = args[args.length - 1];
  if (typeof lastArg === 'function') {
    lastArg(null, 'mock file contents');
    return null;
  }
  return Promise.resolve();
};

export const access = vi.fn(() => Promise.resolve());
export const copy = vi.fn(() => Promise.resolve());
export const copySync = vi.fn();
export const createWriteStream = () => {};
export const emptyDirSync = vi.fn();
export const existsSync = vi.fn(() => true);
export const mkdirp = vi.fn(() => Promise.resolve());
export const pathExists = vi.fn(() => Promise.reject());
export const readdir = vi.fn(() => Promise.resolve([]));
export const readdirSync = vi.fn(() => ([]));
export const readFile = vi.fn(callbackOrPromise);
export const readJson = vi.fn(() => Promise.resolve());
export const rename = vi.fn(() => Promise.resolve());
export const stat = vi.fn(() => ({
  isFile: () => Promise.reject(new Error('stat.isFile')),
}));
export const writeFile = vi.fn((filename, content, cb) => cb());
export const writeJson = vi.fn(() => Promise.reject(new Error('mock writeJson')));
export const unlink = vi.fn(() => Promise.reject(new Error('mock unlink')));

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
