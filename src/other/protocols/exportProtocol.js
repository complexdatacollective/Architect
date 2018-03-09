/* eslint-disable */

import { remote } from 'electron';
import Zip from 'jszip';
import path from 'path';
import fs from 'fs';
import { writeFile, readFile } from '../filesystem';

const saveDialogOptions = {
  buttonLabel: 'Export',
  nameFieldLabel: 'Export as:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Protocols', extensions: ['netcanvas'] }],
};

const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(saveDialogOptions, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

const getAssets = (protocolPath) => {
  const assetsDir = path.join(protocolPath, 'assets');
  const assets = fs.readdirSync(assetsDir);
  return assets.map((filename) => {
    return readFile(path.join(assetsDir, filename))
      .then(data => ({ filename, data }));
  });
};

const createPackage = (protocolPath) => {
  const zip = new Zip();

  return Promise.all([
    readFile(path.join(protocolPath, 'protocol.json'))
      .then(data => {
        zip.file('protocol.json', data);
      }),
    Promise.all(
      getAssets(protocolPath),
    ).then((assets) => {
      console.log(assets);
      const assetsDir = zip.folder('assets');
      assets.forEach((asset) => {
        assetsDir.file(asset.filename, asset.data);
      });
    }),
  ]).then(() => zip);
};

const saveToDisk = zip =>
  saveDialog()
    .then((filename) =>
      new Promise((resolve, reject) => {
        zip
          .generateNodeStream({ streamFiles:true })
          .pipe(fs.createWriteStream(filename))
          .on('error', reject)
          .on('finish', resolve);
      }),
  );

/**
 * Given a protocol object exports that data as a zip
 * @param {object} protocol - The protocol itself.
 */
const exportProtocol = protocolPath =>
  createPackage(protocolPath)
    .then(saveToDisk);

export {
  createPackage,
  saveToDisk,
};

export default exportProtocol;
