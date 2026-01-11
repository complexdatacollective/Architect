/* eslint-disable import/prefer-default-export */
import uuid from 'uuid/v4';
import axios from 'axios';
import { electronAPI } from '@utils/electronBridge';
import { APP_SCHEMA_VERSION, SAMPLE_PROTOCOL_URL } from '@app/config';
import * as netcanvasFile from '@app/utils/netcanvasFile';
import validateProtocol from '@app/utils/validateProtocol';
import { getMigrationNotes } from '@codaco/protocol-validation';
import { getHasUnsavedChanges } from '@selectors/session';
import { getProtocol } from '@selectors/protocol';
import {
  openDialog,
  saveCopyDialog,
  saveDialog,
  createDialogOptions,
} from '@app/utils/dialogs';
import { UnsavedChanges } from '@components/Dialogs';
import { actionCreators as sessionActions, actionTypes as sessionActionTypes } from '@modules/session';
import { actionCreators as dialogsActions } from '@modules/dialogs';
import { actionCreators as toastActions } from '@modules/toasts';
import {
  validationErrorDialog,
  importErrorDialog,
  appUpgradeRequiredDialog,
  mayUpgradeProtocolDialog,
  netcanvasFileErrorHandler,
} from '@modules/userActions/dialogs';
import { createLock } from '@modules/ui/status';
import CancellationError from '@utils/cancellationError';
import { getNewFileName } from '@utils/netcanvasFile/netcanvasFile';
import { createImportToast, updateDownloadProgress } from './userActionToasts';

const protocolsLock = createLock('PROTOCOLS');
const loadingLock = createLock('LOADING');
const savingLock = createLock('SAVING');

const { schemaVersionStates } = netcanvasFile;

// TODO: move this to sessions
const validateAndOpenNetcanvas = (filePath) => (dispatch) => Promise.resolve()
  .then(() => netcanvasFile.validateNetcanvas(filePath)
    .then(() => true))
  .catch((e) => {
    dispatch(validationErrorDialog(e));
    return false;
  })
  .then((isProtocolValid) => dispatch(sessionActions.openNetcanvas(filePath, isProtocolValid)));

const checkUnsavedChanges = () => (dispatch, getState) => Promise.resolve()
  .then(() => getHasUnsavedChanges(getState()))
  .then((hasUnsavedChanges) => {
    if (!hasUnsavedChanges) { return Promise.resolve(true); }

    const unsavedChangesDialog = UnsavedChanges({
      confirmLabel: 'Discard changes and continue',
    });

    return dispatch(dialogsActions.openDialog(unsavedChangesDialog))
      .then((confirm) => {
        if (!confirm) { return Promise.resolve(false); }

        return confirm;
      });
  });

const upgradeProtocol = (filePath, protocolSchemaVersion) => (dispatch) => {
  const migrationNotes = getMigrationNotes(protocolSchemaVersion, APP_SCHEMA_VERSION);
  const upgradeDialog = mayUpgradeProtocolDialog(
    protocolSchemaVersion,
    APP_SCHEMA_VERSION,
    migrationNotes,
  );

  return Promise.resolve()
    .then(() => dispatch(upgradeDialog))
    .then((confirm) => {
      if (!confirm) { return Promise.resolve(null); }

      return getNewFileName(filePath)
        .then(({ canceled, filePath: newFilePath }) => {
          if (canceled || !newFilePath) { return Promise.resolve(null); }

          return netcanvasFile.migrateNetcanvas(filePath, newFilePath, APP_SCHEMA_VERSION)
            .then((migratedFilePath) => dispatch(validateAndOpenNetcanvas(migratedFilePath)));
        });
    });
};

const openNetcanvas = protocolsLock((netcanvasFilePath) => {
  // helper function so we can use loadingLock
  const openOrUpgrade = loadingLock(({ canceled, filePaths }) => (dispatch) => {
    const filePath = filePaths && filePaths[0];
    if (canceled || !filePath) { return Promise.resolve(null); }

    return netcanvasFile.checkSchemaVersion(filePath)
      .then(([protocolSchemaVersion, schemaVersionStatus]) => {
        switch (schemaVersionStatus) {
          case schemaVersionStates.OK:
            return dispatch(validateAndOpenNetcanvas(filePath));
          case schemaVersionStates.UPGRADE_PROTOCOL:
            return dispatch(upgradeProtocol(filePath, protocolSchemaVersion));
          case schemaVersionStates.UPGRADE_APP:
            return dispatch(appUpgradeRequiredDialog(protocolSchemaVersion));
          default:
            return Promise.resolve(null);
        }
      })
      .catch((e) => {
        dispatch(netcanvasFileErrorHandler(e, { filePath }));
        dispatch({
          type: sessionActionTypes.OPEN_NETCANVAS_ERROR,
          payload: { error: e, filePath },
        });
      });
  });

  // actual dispatched action
  return (dispatch) => Promise.resolve()
    .then(() => dispatch(checkUnsavedChanges())) // Check for unsaved changes in open file
    .then((proceed) => {
      if (!proceed) { return Promise.resolve({ canceled: true }); }

      if (netcanvasFilePath) {
        return Promise.resolve({ canceled: null, filePaths: [netcanvasFilePath] });
      }

      return openDialog();
    })
    .then(({ canceled, filePaths }) => dispatch(openOrUpgrade({ canceled, filePaths })))
    .catch((e) => dispatch(netcanvasFileErrorHandler(e, { filePath: netcanvasFilePath })));
});

const createNetcanvas = () => (dispatch) => Promise.resolve()
  .then(() => dispatch(checkUnsavedChanges))
  .then((confirm) => {
    if (!confirm) { return Promise.resolve(null); }

    return saveDialog(createDialogOptions)
      .then(({ canceled, filePath }) => {
        if (canceled) { return Promise.resolve(null); }

        return netcanvasFile.createNetcanvas(filePath)
          .then((destinationPath) => dispatch(sessionActions.openNetcanvas(destinationPath)));
      });
  })
  .catch((e) => dispatch(netcanvasFileErrorHandler(e)));

const saveAsNetcanvas = () => {
  // helper function so we can use savingLock
  const saveAndOpen = savingLock(
    ({ canceled, filePath }) => (dispatch) => {
      if (canceled) { return Promise.resolve(null); }
      return dispatch(sessionActions.saveAsNetcanvas(filePath))
        .then((savePath) => dispatch(validateAndOpenNetcanvas(savePath)))
        .catch((e) => dispatch(netcanvasFileErrorHandler(e, { filePath })));
    },
  );

  // actual dispatched action
  return (dispatch) => saveCopyDialog()
    .then(({ canceled, filePath }) => dispatch(saveAndOpen({ canceled, filePath })))
    .catch((e) => dispatch(netcanvasFileErrorHandler(e)));
};

const saveNetcanvas = () => (dispatch, getState) => {
  const state = getState();
  const protocol = getProtocol(state);
  const { filePath } = state.session;

  return validateProtocol(protocol)
    .catch((e) => dispatch(validationErrorDialog(e)))
    .then(() => dispatch(sessionActions.saveNetcanvas()))
    .catch((e) => dispatch(netcanvasFileErrorHandler(e, { filePath })));
};

const printOverview = () => (dispatch, getState) => {
  const payload = ((state) => ({
    filePath: state.session.filePath,
    workingPath: state.session.workingPath,
    protocol: state.protocol.present,
  }))(getState());

  dispatch({ ipc: true, type: 'PRINT_SUMMARY_DATA', payload });
};

const importSampleProtocol = () => async (dispatch) => {
  let userFilePath; // Path to save the file, chosen by user
  let tempFilePath; // Temp file path for downloading to
  let userCancelled = false; // Flag to determine if the user cancels
  const importUUID = uuid(); // Identifier to avoid file name collisions
  const controller = new AbortController(); // Abort controller for axios

  // Utility that attempts to clean up temp files, and
  // ensures import toast is removed
  const handleCleanup = async () => {
    dispatch(toastActions.removeToast(importUUID));

    if (tempFilePath) {
      try {
        await electronAPI.fs.unlink(tempFilePath);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error removing temp file path: ', e);
      }
    }
  };

  // Called when the user clicks close button on import toast
  const handleCancel = () => {
    controller.abort(); // Abort the axios request
    userCancelled = true; // Set the cancellation flag to abort future steps

    handleCleanup();
  };

  const checkIfUserCancelled = () => {
    if (userCancelled) { throw new CancellationError(); }
  };

  try {
    const { canceled, filePath } = await saveDialog({
      defaultPath: '*/Sample Protocol',
    });

    if (canceled) { throw new CancellationError(); }
    userFilePath = filePath;

    checkIfUserCancelled();
    dispatch(createImportToast(importUUID, handleCancel));

    const response = await axios.get(SAMPLE_PROTOCOL_URL, {
      signal: controller.signal,
      responseType: 'arraybuffer',
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch(updateDownloadProgress(importUUID, percentCompleted));
      },
    }).catch((error) => {
      if (error.code === 'ERR_CANCELED') { throw new CancellationError(); }
      throw new Error(error);
    });

    checkIfUserCancelled();

    const tempPath = await electronAPI.app.getPath('temp');
    tempFilePath = await electronAPI.path.join(tempPath, 'architect', importUUID);
    await electronAPI.fs.outputFile(tempFilePath, Buffer.from(response.data));

    checkIfUserCancelled();

    await electronAPI.fs.rename(tempFilePath, userFilePath);

    checkIfUserCancelled();

    await handleCleanup();
    dispatch(openNetcanvas(userFilePath));
  } catch (error) {
    await handleCleanup();

    if (error instanceof CancellationError) {
      // eslint-disable-next-line no-console
      console.info('User cancelled the protocol import');
      return;
    }

    dispatch(importErrorDialog(error));
  }
};

export const actionLocks = {
  loading: loadingLock,
  protocols: protocolsLock,
  saving: savingLock,
};

export const actionCreators = {
  openNetcanvas,
  createNetcanvas: protocolsLock(createNetcanvas),
  saveAsNetcanvas: protocolsLock(saveAsNetcanvas), // savingLock
  saveNetcanvas: protocolsLock(savingLock(saveNetcanvas)), // savingLock
  importSampleProtocol,
  printOverview,
};
