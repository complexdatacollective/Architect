import uuid from 'uuid/v1';
import { findKey, toLower } from 'lodash';
import { electronAPI } from '@utils/electronBridge';
import { SUPPORTED_EXTENSION_TYPE_MAP } from '@app/config';

/**
 * Function that determines the type of an asset file when importing. Types are defined
 * as one of 'network', 'image', 'audio', or video.
 *
 * Uses the mime type where possible, and falls back to the file extension.
 *
 * @param {string} asset - the filename of the asset
 * @return {string} Returns one of network, image, audio, video, geojson, env, or returns false if
 * type is unsupported
 */
export const getSupportedAssetType = async (filePath) => {
  const extension = toLower(await electronAPI.path.extname(filePath));

  const typeFromMap = findKey(SUPPORTED_EXTENSION_TYPE_MAP, (type) => type.includes(extension));

  return typeFromMap || false;
};

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {string} filePath - The file buffer to copy.
 */
const importAsset = async (protocolPath, filePath) => {
  const extname = await electronAPI.path.extname(filePath);
  const destinationName = `${uuid()}${extname}`;
  const destinationPath = await electronAPI.path.join(protocolPath, 'assets', destinationName);
  const assetType = await getSupportedAssetType(filePath);

  await electronAPI.fs.copy(filePath, destinationPath);

  return { filePath: destinationName, assetType };
};

export default importAsset;
