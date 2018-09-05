import { importAssetToProtocol } from '../../../other/protocols';
import { getActiveProtocolMeta } from '../../../selectors/protocol';

const IMPORT_ASSET = Symbol('PROTOCOL/IMPORT_ASSET');
const IMPORT_ASSET_COMPLETE = Symbol('PROTOCOL/IMPORT_ASSET_COMPLETE');
const IMPORT_ASSET_FAILED = Symbol('PROTOCOL/IMPORT_ASSET_FAILED');

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
 */
const importAssetComplete = filename =>
  ({
    type: IMPORT_ASSET_COMPLETE,
    filename,
  });

const importAssetFailed = () =>
  ({
    type: IMPORT_ASSET_FAILED,
  });

/**
 * @param {File} asset - File to import
 */
const importAssetAction = asset =>
  (dispatch, getState) => {
    dispatch(importAsset(asset));
    const state = getState();
    const { workingPath } = getActiveProtocolMeta(state);
    if (!workingPath) { return Promise.reject(dispatch(importAssetFailed())); }
    return importAssetToProtocol(workingPath, asset)
      .then(filename => dispatch(importAssetComplete(filename)))
      .catch(() => dispatch(importAssetFailed()));
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
