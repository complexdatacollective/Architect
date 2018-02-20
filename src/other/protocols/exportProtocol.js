import { remote } from 'electron';
import Zip from 'jszip';
import { has } from 'lodash';
import { writeFile, readFile } from '../filesystem';

const saveDialogOptions = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save as:',
};

const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(saveDialogOptions, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

const getDataForAsset = asset =>
  new Promise((reject, resolve) => {
    if (has(asset, 'data')) { resolve(asset); } // TODO: Should we keep this?
    if (has(asset, 'filename')) {
      const fileData = readFile(asset.filename);

      resolve({ ...asset, data: fileData });
    }

    reject();
  });

const getDataForAssets = (assetRegistry) => {
  if (!assetRegistry) { return []; }

  return assetRegistry.map(
    asset => getDataForAsset(asset),
  );
};

const createPackage = (protocol) => {
  const zip = new Zip();
  zip.file('protocol.json', JSON.stringify(protocol));

  // TODO: This is defunct, we will include all files in the assets dir
  return Promise.all(
    getDataForAssets(protocol.assetRegistry),
  ).then((assets) => {
    const assetsDir = zip.folder('assets');
    assets.forEach((asset) => {
      assetsDir.file(asset.name, asset.data, { base64: true });
    });
  }).then(() => zip.generateAsync({ type: 'blob' }));
};

// Expects data blob e.g.
// const zip = new Zip();
// zip.file('Hello.txt', 'Hello World\n');
// zip.generateAsync({ type: 'blob' }),
const saveToDisk = content =>
  saveDialog().then(
    filename => writeFile(filename, content),
  );

/**
 * Given a protocol object exports that data as a zip
 * @param {object} protocol - The protocol itself.
 */
const exportProtocol = protocol =>
  createPackage(protocol).then(saveToDisk);

export {
  createPackage,
  saveToDisk,
};

export default exportProtocol;
