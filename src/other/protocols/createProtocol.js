import { remote } from 'electron';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {
  getLocalDirectoryFromArchivePath,
  archive,
} from './archive';
import template from './template.json';

const saveDialogOptions = {
  buttonLabel: 'Create',
  nameFieldLabel: 'Create as:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Protocols', extensions: ['netcanvas'] }],
};

/**
 * Shows a save dialog (wrapped in a promise)
 */
const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(saveDialogOptions, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

const createEmptyProtocol = workingPath =>
  new Promise((resolve) => {
    const assetsPath = path.join(workingPath, 'assets');
    const protocolPath = path.join(workingPath, 'protocol.json');
    mkdirp.sync(workingPath);
    fs.mkdirSync(assetsPath);
    fs.writeFileSync(protocolPath, JSON.stringify(template, null, 2));
    resolve();
  });

export const createEmptyArchive = ({ workingPath, archivePath }) =>
  createEmptyProtocol(workingPath)
    .then(archive(workingPath, archivePath));

/**
 * Shows a save dialog and then creates an empty protocol there
 */
const createProtocol = () =>
  saveDialog()
    .then((archivePath) => {
      const workingPath = getLocalDirectoryFromArchivePath(archivePath);

      return createEmptyArchive({
        workingPath,
        archivePath,
      })
        .then(() => ({
          workingPath,
          archivePath,
        }));
    });

export default createProtocol;
