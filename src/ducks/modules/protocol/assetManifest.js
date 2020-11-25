import uuid from 'uuid';
import { omit } from 'lodash';
import path from 'path';
import log from 'electron-log';
import { importAsset as fsImportAsset } from '@app/utils/protocols';
import { getWorkingPath } from '@selectors/session';
import { validateAsset } from '@app/utils/protocols/assetTools';
import { invalidAssetErrorDialog, importAssetErrorDialog } from '@modules/protocol/utils/dialogs';

const IMPORT_ASSET = 'PROTOCOL/IMPORT_ASSET';
const IMPORT_ASSET_COMPLETE = 'PROTOCOL/IMPORT_ASSET_COMPLETE';
const IMPORT_ASSET_FAILED = 'PROTOCOL/IMPORT_ASSET_FAILED';
const DELETE_ASSET = 'PROTOCOL/DELETE_ASSET';

const getNameFromFilename = filename =>
  path.parse(filename).base;

const deleteAsset = id =>
  ({
    type: DELETE_ASSET,
    id,
  });

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
const importAssetFailed = (filename, error) =>
  ({
    type: IMPORT_ASSET_FAILED,
    filename,
    error,
  });

/**
 * @param {File} filePath - File path to import
 */
const importAssetThunk = filePath =>
  (dispatch, getState) => {
    const state = getState();
    const workingPath = getWorkingPath(state);
    const name = getNameFromFilename(filePath);

    dispatch(importAsset(name));
    log.info('Import asset', filePath);

    if (!workingPath) {
      const error = new Error('No working path found, possibly no active protocol.');
      dispatch(importAssetFailed(filePath, error));
      dispatch(importAssetErrorDialog(error, filePath));
      return Promise.reject(error);
    }

    return Promise.resolve()
      .then(() =>
        validateAsset(filePath)
          .catch((error) => {
            log.error('  INVALID ASSET', error);
            dispatch(invalidAssetErrorDialog(error, filePath));
            throw error;
          }),
      )
      .then(() =>
        fsImportAsset(workingPath, filePath)
          .catch((error) => {
            log.error('  IMPORT ERROR', error);
            dispatch(importAssetErrorDialog(error, filePath));
            throw error;
          }),
      )
      .then((result) => {
        log.info('  OK');
        return dispatch(importAssetComplete(result.filePath, name, result.assetType));
      })
      .catch(error => dispatch(importAssetFailed(filePath, error)));
  };

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IMPORT_ASSET_COMPLETE:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          type: action.assetType,
          name: action.name,
          source: action.filename,
        },
      };
    case DELETE_ASSET:
      // Don't delete from disk, this allows us to rollback the protocol.
      // Disk changes should be commited on save.
      return omit(state, action.id);
    default:
      return state;
  }
}

const actionCreators = {
  importAsset: importAssetThunk,
  importAssetComplete,
  deleteAsset,
};

const actionTypes = {
  IMPORT_ASSET,
  IMPORT_ASSET_COMPLETE,
  IMPORT_ASSET_FAILED,
  DELETE_ASSET,
};

const testing = {
  importAssetComplete,
  deleteAsset,
};

export {
  actionCreators,
  actionTypes,
  testing,
};
