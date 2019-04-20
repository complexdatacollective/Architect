/* eslint-disable */

const mockProtocol = require('./mockProtocol.json');
const mockExternalJSONData = require('./mockExternalData.json');
const mockExternalCSVData = "Name,Nickname,Age\nAnita,Annie,21\nBarry,Baz,28\nCarlito,Carl,23\nDee,Dee,40\nEugine,Eu,18\n";

const copySync = () => {};
const emptyDirSync = () => {};
const readJson = (...args) => {
  const filename = args.shift();

  switch(true) {
    case /protocol\.json$/.test(filename):
      return Promise.resolve(mockProtocol);
    case /\.json$/.test(filename):
      return Promise.resolve(mockExternalJSONData);
    default:
      return Promise.resolve({});
  }
};

const readFile = (...args) => {
  const filename = args.shift();

  switch(true) {
      case /\.csv$/.test(filename):
      return Promise.resolve(mockExternalCSVData);
    default:
      return Promise.resolve('');
  }
};

module.exports = {
  copySync,
  emptyDirSync,
  readJson,
  readFile,
};
