import { get } from 'lodash';
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

const importAssetFailed = () =>
  ({
    type: IMPORT_ASSET_FAILED,
  });

/**
 * @param {File} asset - File to import
 */
const importAssetAction = asset =>
  (dispatch, getState) => {
    const workingPath = get(getState(), ['session', 'activeProtocol', 'workingPath']);
    if (!workingPath) { dispatch(importAssetFailed()); return Promise.reject(); }
    return importAssetToProtocol(workingPath, asset)
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
