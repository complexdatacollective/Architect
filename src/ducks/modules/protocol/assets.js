import { importAssetToProtocol } from '../../../other/protocols';

const IMPORT_ASSET_COMPLETE = Symbol('PROTOCOL/IMPORT_ASSET_COMPLETE');
const IMPORT_ASSET_FAILED = Symbol('PROTOCOL/IMPORT_ASSET_FAILED');

/**
 * @param {string} filename - Name of file
 */
const importAssetComplete = filename =>
  ({
    type: IMPORT_ASSET_COMPLETE,
    filename,
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
const importAssetAction = asset =>
  (dispatch, getState) => {
    const protocolPath = getState().session.activeProtocol;
    return importAssetToProtocol(protocolPath, asset)
      .then(filename => dispatch(importAssetComplete(filename)))
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
