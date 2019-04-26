/* eslint-disable */


const fs = require('fs');
const path = require('path');
const mockProtocol = require('./mockProtocol.json');
const mockExternalJSONData = require('./mockExternalData.json');
const mockExternalCSVData = "Name,Nickname,Age\nAnita,Annie,21\nBarry,Baz,28\nCarlito,Carl,23\nDee,Dee,40\nEugine,Eu,18\n";

const copySync = () => {};
const emptyDirSync = () => {};
const writeFile = (filename, content, callback) => { callback(); };
const writeFileSync = (filename, content) => {};
const mkdirSync = () => {};
const existsSync = () => true;
const unlinkSync = () => true;
const readdirSync = () => ([]);

const createWriteStream = () => {
  return {
    on: (event, callback) => {
      if (event === 'close') {
        callback();
      }
    },
  };
}

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

  console.log('hi');

  switch(true) {
    case /\.csv$/.test(filename):
      return Promise.resolve(mockExternalCSVData);
    default:
      return Promise.resolve('');
  }
};

const readFileSync = (filename) => {
  switch(true) {
    case /\.json$/.test(filename):
      return JSON.stringify(mockProtocol);
    default:
      return '';
  }
}

module.exports = {
  copySync,
  emptyDirSync,
  readJson,
  readFile,
  writeFile,
  writeFileSync,
  mkdirSync,
  existsSync,
  unlinkSync,
  readdirSync,
  createWriteStream,
};
