/* eslint-disable global-require */
import { trimChars } from 'lodash/fp';
import environments from './environments';
import inEnvironment from './Environment';

const trimPath = trimChars('/ ');

export const splitUrl = (targetPath) => {
  const pathParts = trimPath(targetPath).split('/');
  const baseDirectory = `${pathParts.slice(0, -1).join('/')}/`;
  const directory = `${pathParts.slice(-1)}`;
  return [baseDirectory, directory];
};

const resolveFileSystemUrl = inEnvironment((environment) => {
  if (environment === environments.CORDOVA) {
    return (path) => new Promise(
      (resolve, reject) => window.resolveLocalFileSystemURL(path, resolve, reject),
    );
  }

  throw new Error(`resolveFileSystemUrl() not available on platform ${environment}`);
});

const makeFileWriter = (fileEntry) => new Promise((resolve, reject) => {
  fileEntry.createWriter(resolve, reject);
});

const newFile = (directoryEntry, filename) => new Promise((resolve, reject) => {
  directoryEntry.getFile(filename, { create: true }, resolve, reject);
});

const writeFile = inEnvironment((environment) => {
  if (environment === environments.CORDOVA) {
    return (fileUrl, data) => {
      const [baseDirectory, filename] = splitUrl(fileUrl);

      return resolveFileSystemUrl(baseDirectory)
        .then((directoryEntry) => newFile(directoryEntry, filename))
        .then(makeFileWriter)
        .then((fileWriter) => new Promise((resolve, reject) => {
          fileWriter.onwriteend = () => resolve(fileUrl); // eslint-disable-line no-param-reassign
          fileWriter.onerror = (error) => reject(error); // eslint-disable-line no-param-reassign
          fileWriter.write(data);
        }));
    };
  }

  if (environment === environments.ELECTRON) {
    const fs = require('fs');

    return (filePath, data) => new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (error) => {
        if (error) { reject(error); }
        resolve(filePath);
      });
    });
  }

  throw new Error(`writeFile() not available on platform ${environment}`);
});

export {
  writeFile,
};
