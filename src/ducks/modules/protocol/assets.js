import uuid from 'uuid';
import { importAssetToProtocol } from '../../../other/protocols';
import { getActiveProtocolMeta } from '../../../selectors/protocol';

const IMPORT_ASSET = Symbol('PROTOCOL/IMPORT_ASSET');
const IMPORT_ASSET_COMPLETE = Symbol('PROTOCOL/IMPORT_ASSET_COMPLETE');
const IMPORT_ASSET_FAILED = Symbol('PROTOCOL/IMPORT_ASSET_FAILED');

const getNameFromFilename = filename =>
  filename.split('.')[0];

/**
 * @param {string} filename - Name of file
 */
const importAsset = filename =>
  ({
    type: IMPORT_ASSET,
    filename,
  });

/**
 * @param {string} filename - Name of file
 * @param {string} fileType - File MIME type
 */
const importAssetComplete = (filename, name, assetType) =>
  ({
    id: uuid(),
    type: IMPORT_ASSET_COMPLETE,
    name,
    filename,
    assetType,
  });

/**
 * @param {string} filename - Name of file
 */
const importAssetFailed = filename =>
  ({
    type: IMPORT_ASSET_FAILED,
    filename,
  });

/**
 * @param {File} asset - File to import
 */
const importAssetAction = (asset, type) =>
  (dispatch, getState) => {
    const state = getState();
    const { workingPath } = getActiveProtocolMeta(state);
    const name = getNameFromFilename(asset.name);
    const reject = () =>
      dispatch(importAssetFailed(name));

    dispatch(importAsset(name));

    if (!workingPath) { return Promise.reject(reject()); }

    return importAssetToProtocol(workingPath, asset)
      .then(filename =>
        dispatch(importAssetComplete(filename, name, type)))
      .catch(reject);
  };

const actionCreators = {
  importAsset: importAssetAction,
};

const actionTypes = {
  IMPORT_ASSET,
  IMPORT_ASSET_COMPLETE,
  IMPORT_ASSET_FAILED,
};

export {
  actionCreators,
  actionTypes,
};
