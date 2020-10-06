import path from 'path';
import uuid from 'uuid/v1';
import { findKey, toLower } from 'lodash';
import { copy } from 'fs-extra';
import { SUPPORTED_EXTENSION_TYPE_MAP } from '@app/config';

/**
 * Function that determines the type of an asset file when importing. Types are defined
 * as one of 'network', 'image', 'audio', or video.
 *
 * Uses the mime type where possible, and falls back to the file extension.
 *
 * @param {string} asset - the filename of the asset
 * @return {string} Returns one of network, image, audio, video or returns false if type
 * is unsupported
 */
export const getSupportedAssetType = (filePath) => {
  const extension = toLower(path.extname(filePath));

  const typeFromMap = findKey(SUPPORTED_EXTENSION_TYPE_MAP, type => type.includes(extension));

  return typeFromMap || false;
};

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {string} filePath - The file buffer to copy.
 */
const importAsset = (protocolPath, filePath) =>
  new Promise((resolve) => {
    const destinationName = `${uuid()}${path.extname(filePath)}`;
    const destinationPath = path.join(protocolPath, 'assets', destinationName);
    const assetType = getSupportedAssetType(filePath);

    copy(filePath, destinationPath)
      .then(() => ({ filePath: destinationName, assetType }))
      .then(resolve);
  });

export default importAsset;
