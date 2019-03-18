/* eslint-disable */

const mockProtocol = require('./mockProtocol.json');

const copySync = () => {};
const emptyDirSync = () => {};
const readJson = (...args) => {
  const filename = args.shift();

  switch(true) {
    case /\.json$/.test(filename):
      return Promise.resolve(mockProtocol);
    default:
      return Promise.resolve({});
  }
};

module.exports = {
  copySync,
  emptyDirSync,
  readJson,
};
