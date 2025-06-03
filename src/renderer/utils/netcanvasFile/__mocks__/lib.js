/* eslint-env jest */

const defaultImplementation = (name) => () => Promise.reject(new Error(`lib mock ${name}`));

const getTempDir = jest.fn(defaultImplementation('getTempDir'));
const readProtocol = jest.fn(defaultImplementation('readProtocol'));
const writeProtocol = jest.fn(defaultImplementation('writeProtocol'));
const deployNetcanvas = jest.fn(defaultImplementation('deployNetcanvas'));
const commitNetcanvas = jest.fn(defaultImplementation('commitNetcanvas'));
const revertNetcanvas = jest.fn(defaultImplementation('revertNetcanvas'));
const createNetcanvasExport = jest.fn(defaultImplementation('createNetcanvasExport'));
const importNetcanvas = jest.fn(defaultImplementation('importNetcanvas'));

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
