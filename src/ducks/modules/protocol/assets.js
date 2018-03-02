import { importAssetToProtocol } from '../../../other/protocols';

const IMPORT_ASSET_COMPLETE = Symbol('PROTOCOL/IMPORT_ASSET_COMPLETE');
const IMPORT_ASSET_FAILED = Symbol('PROTOCOL/IMPORT_ASSET_FAILED');

/**
 * @param {string} name - Name of file
 */
const importAssetComplete = name =>
  ({
    type: IMPORT_ASSET_COMPLETE,
    name,
  });

  /**
 * @param {string} name - Name of file
 */
const importAssetFailed = name =>
  ({
    type: IMPORT_ASSET_FAILED,
    name,
  });

/**
 * @param {File} asset - File to import
 */
const importAssetAction = asset =>
  (dispatch, getState) => {
    const protocolPath = getState().session.activeProtocol;
    return importAssetToProtocol(protocolPath, asset)
      .then(name => dispatch(importAssetComplete(name)))
      .catch(() => dispatch(importAssetFailed()));
  };

const actionCreators = {
  importAsset: importAssetAction,
};

const actionTypes = {
  IMPORT_ASSET_COMPLETE,
  IMPORT_ASSET_FAILED,
};

export {
  actionCreators,
  actionTypes,
};
