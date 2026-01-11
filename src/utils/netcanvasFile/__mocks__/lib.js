import { vi } from 'vitest';

const defaultImplementation = (name) => () => Promise.reject(new Error(`lib mock ${name}`));

const getTempDir = vi.fn(defaultImplementation('getTempDir'));
const readProtocol = vi.fn(defaultImplementation('readProtocol'));
const writeProtocol = vi.fn(defaultImplementation('writeProtocol'));
const deployNetcanvas = vi.fn(defaultImplementation('deployNetcanvas'));
const commitNetcanvas = vi.fn(defaultImplementation('commitNetcanvas'));
const revertNetcanvas = vi.fn(defaultImplementation('revertNetcanvas'));
const createNetcanvasExport = vi.fn(defaultImplementation('createNetcanvasExport'));
const importNetcanvas = vi.fn(defaultImplementation('importNetcanvas'));

export {
  getTempDir,
  readProtocol,
  writeProtocol,
  deployNetcanvas,
  commitNetcanvas,
  revertNetcanvas,
  createNetcanvasExport,
  importNetcanvas,
};
