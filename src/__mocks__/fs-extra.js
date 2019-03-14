/* eslint-env jest */

const copySync = jest.fn();
const emptyDirSync = jest.fn();
const readJson = jest.fn(() => Promise.resolve());

export default {
  copySync,
  emptyDirSync,
  readJson,
};
