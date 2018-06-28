import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import { readFile } from '../filesystem';

const tempPath = remote.app.getPath('temp');

const contains = (protocol, string) =>
  protocol.indexOf(string) !== -1;

const isInTempPath = filePath =>
  new RegExp(`^${tempPath}`)
    .test(path.normalize(filePath));

const removeFile = (filePath) => {
  console.log('Removing', filePath);
  // Check we haven't somehow ended up outside of temppath since we are deleting things
  if (!isInTempPath(filePath)) { console.log('Aborted remove because outside of temp'); return; }

  fs.unlinkSync(filePath);
};

/**
 * Remove unused protocol assets
 * @param {string} workingPath - The working directory of the protocol to prune
 */
const pruneProtocolAssets = (workingPath) => {
  const protocolPath = path.join(workingPath, 'protocol.json');
  const protocolAssetsPath = path.join(workingPath, 'assets');

  // Read protocol file
  return readFile(protocolPath)
    .then((protocolFile) => {

      // List assets directory
      const files = fs.readdirSync(protocolAssetsPath);

      files.forEach((fileName) => {
        const filePath = path.join(workingPath, 'assets', fileName);

        // If asset filename contained in protocol then remove it
        // This simply checks the filename is contained in the protocol (as a string), since
        // filenames are uids, this should be unlikey to return false negatives - this check
        // shouldn't ever return false positives.
        if (!contains(protocolFile, fileName)) {
          removeFile(filePath);
        }
      });
    });
};

export default pruneProtocolAssets;
