import uuid from 'uuid';
import { omit } from 'lodash';
import log from '@utils/logger';
import { pathSync } from '@utils/electronBridge';
import { importAsset as fsImportAsset } from '@app/utils/protocols';
import { getWorkingPath } from '@selectors/session';
import { validateAsset } from '@app/utils/protocols/assetTools';
import { invalidAssetErrorDialog, importAssetErrorDialog } from '@modules/protocol/utils/dialogs';
import { saveableChange } from '../session';

const IMPORT_ASSET = 'PROTOCOL/IMPORT_ASSET';
const IMPORT_ASSET_COMPLETE = 'PROTOCOL/IMPORT_ASSET_COMPLETE';
const IMPORT_ASSET_FAILED = 'PROTOCOL/IMPORT_ASSET_FAILED';
const DELETE_ASSET = 'PROTOCOL/DELETE_ASSET';
const ADD_API_KEY_ASSET = 'PROTOCOL/ADD_API_KEY_ASSET';

const getNameFromFilename = (filename) => pathSync.parse(filename).base;

const deleteAsset = (id) => ({
  type: DELETE_ASSET,
  id,
});

/**
 * @param {string} filename - Name of file
 */
const importAsset = (filename) => ({
  type: IMPORT_ASSET,
  filename,
});

/**
 * @param {string} filename - Name of file
 * @param {string} fileType - File MIME type
 */
export const importAssetComplete = (filename, name, assetType) => ({
  id: uuid(),
  type: IMPORT_ASSET_COMPLETE,
  name,
  filename,
  assetType,
});

/**
 * @param {string} filename - Name of file
 */
const importAssetFailed = (filename, error) => ({
  type: IMPORT_ASSET_FAILED,
  filename,
  error,
});

/**
 * @param {File} filePath - File path to import
 */
const importAssetThunk = (filePath) => (dispatch, getState) => {
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
    .then(() => validateAsset(filePath)
      .catch((error) => {
        dispatch(invalidAssetErrorDialog(error, filePath));
        log.error('Validation error', error);
        throw error;
      }))
    .then(() => fsImportAsset(workingPath, filePath)
      .catch((error) => {
        log.error('Import error', error);
        dispatch(importAssetErrorDialog(error, filePath));
        throw error;
      }))
    .then((result) => {
      log.info('  OK');
      return dispatch(saveableChange(importAssetComplete)(result.filePath, name, result.assetType));
    })
    .catch((error) => dispatch(importAssetFailed(filePath, error)));
};

/**
 * @param {string} name - The name of the API key
 * @param {string} value - The value of the API key
 */
export const addApiKeyAsset = (name, value) => ({
  type: ADD_API_KEY_ASSET,
  id: uuid(),
  name,
  value,
});

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
    case ADD_API_KEY_ASSET:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          type: 'apikey',
          name: action.name,
          value: action.value,
        },
      };

    default:
      return state;
  }
}

const actionCreators = {
  importAsset: importAssetThunk,
  deleteAsset: saveableChange(deleteAsset),
  addApiKeyAsset: saveableChange(addApiKeyAsset),
};

const actionTypes = {
  IMPORT_ASSET,
  IMPORT_ASSET_COMPLETE,
  IMPORT_ASSET_FAILED,
  DELETE_ASSET,
  ADD_API_KEY_ASSET,
};

const test = {
  importAssetComplete,
  deleteAsset,
};

export {
  actionCreators,
  actionTypes,
  test,
};
