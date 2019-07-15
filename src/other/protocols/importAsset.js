import path from 'path';
import uuid from 'uuid/v1';
import { findKey } from 'lodash';
import { writeFile } from 'fs-extra';
import readFileAsBuffer from './lib/readFileAsBuffer';

const getTypeFromMime = (mime) => {
  const MIME_TYPES = [
    [/text\/csv/, 'network'],
    [/application\/json/, 'network'],
    [/text\/*,/, 'network'],
    [/image\/.*/, 'image'],
    [/audio\/.*/, 'audio'],
    [/video\/.*/, 'video'],
  ];

  const match = MIME_TYPES.find(([matcher]) => matcher.test(mime));
  if (!match) { return null; }
  return match[1];
};

const getTypeFromExtension = (name) => {
  const EXTENSION_TYPES = {
    network: ['csv', 'json'], // .csv
    image: ['jpg', 'jpeg', 'gif', 'png'],
    audio: ['mp3', 'aiff'],
    video: ['mov', 'mp4'],
  };

  const extension = path.extname(name);

  return findKey(EXTENSION_TYPES, type => type.includes(extension));
};

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {buffer} file - The file buffer to copy.
 */
const importAsset = (protocolPath, file) => {
  const destinationName = `${uuid()}${path.extname(file.name)}`;
  const destinationPath = path.join(protocolPath, 'assets', destinationName);
  const assetType = getTypeFromMime(file.type) || getTypeFromExtension(file.name);

  return readFileAsBuffer(file)
    .then(data => writeFile(destinationPath, data))
    .then(() => ({ filePath: destinationName, assetType }));
};

/**
 * Checks that imported asset is valid
 * @param {buffer} file - The file to check.
 */
export const validateAsset = () => {
};

export default importAsset;
