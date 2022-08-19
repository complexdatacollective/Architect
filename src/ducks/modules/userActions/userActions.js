/* eslint-disable import/prefer-default-export */
import React from 'react';
import path from 'path';
import uuid from 'uuid';
import { CancellationError } from 'builder-util-runtime';
import { APP_SCHEMA_VERSION } from '@app/config';
import * as netcanvasFile from '@app/utils/netcanvasFile';
import validateProtocol from '@app/utils/validateProtocol';
import getMigrationNotes from '@app/protocol-validation/migrations/getMigrationNotes';
import { getHasUnsavedChanges } from '@selectors/session';
import { getProtocol } from '@selectors/protocol';
import { ProgressBar, Spinner } from '@codaco/ui';
import {
  openDialog,
  saveCopyDialog,
  saveDialog,
  createDialogOptions,
} from '@app/utils/dialogs';
import { UnsavedChanges } from '@components/Dialogs';
import { actionCreators as sessionActions, actionTypes as sessionActionTypes } from '@modules/session';
import { actionCreators as dialogsActions } from '@modules/dialogs';
import {
  validationErrorDialog,
  appUpgradeRequiredDialog,
  mayUpgradeProtocolDialog,
  netcanvasFileErrorHandler,
} from '@modules/userActions/dialogs';
import { createLock } from '@modules/ui/status';
import electron, { BrowserWindow } from 'electron';
import { rename, writeFile, remove } from 'fs-extra';
import fetch from 'node-fetch';
import friendlyErrorMessage from '../../../utils/friendlyErrorMessage';
import { actionCreators as toastActions } from '../toasts';

const protocolsLock = createLock('PROTOCOLS');
const loadingLock = createLock('LOADING');
const savingLock = createLock('SAVING');

const { schemaVersionStates } = netcanvasFile;

const showCancellationToast = () => (dispatch) => {
  dispatch(toastActions.addToast({
    type: 'warning',
    title: 'Import cancelled',
    content: (
      <>
        <p>You cancelled the import of this protocol.</p>
      </>
    ),
  }));
};

// TODO: move this to sessions
const validateAndOpenNetcanvas = (filePath, cancelled) => (dispatch) => Promise.resolve()
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

const getNewFileName = (filePath) => Promise.resolve(path.basename(filePath, '.netcanvas'))
  .then((basename) => saveDialog({
    buttonLabel: 'Save',
    nameFieldLabel: 'Save:',
    defaultPath: `${basename} (schema version ${APP_SCHEMA_VERSION}).netcanvas`,
    filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  }));

const upgradeProtocol = (filePath, protocolSchemaVersion, toastUUID, cancelled) => (dispatch) => {
  const migrationNotes = getMigrationNotes(protocolSchemaVersion, APP_SCHEMA_VERSION);
  const upgradeDialog = mayUpgradeProtocolDialog(
    protocolSchemaVersion,
    APP_SCHEMA_VERSION,
    migrationNotes,
  );

  return Promise.resolve()
    .then(() => dispatch(upgradeDialog))
    .then((confirm) => {
      if (!confirm) {
        dispatch(toastActions.removeToast(toastUUID));
        dispatch(showCancellationToast());
        return Promise.resolve(null);
      }

      return getNewFileName(filePath)
        .then(({ canceled, filePath: newFilePath }) => {
          if (canceled || !newFilePath) {
            dispatch(toastActions.removeToast(toastUUID));
            dispatch(showCancellationToast());
            return Promise.resolve(null);
          }

          return netcanvasFile.migrateNetcanvas(filePath, newFilePath, APP_SCHEMA_VERSION)
            .then((migratedFilePath) => dispatch(validateAndOpenNetcanvas(migratedFilePath, cancelled)));
        });
    });
};

const openNetcanvas = (netcanvasFilePath, toastUUID, cancelled) => {
  // helper function so we can use loadingLock
  const openOrUpgrade = loadingLock(({ canceled, filePaths }) => (dispatch) => {
    const filePath = filePaths && filePaths[0];
    if (canceled || !filePath) { return Promise.resolve(null); }

    return netcanvasFile.checkSchemaVersion(filePath)
      .then(([protocolSchemaVersion, schemaVersionStatus]) => {
        switch (schemaVersionStatus) {
          case schemaVersionStates.OK:
            return dispatch(validateAndOpenNetcanvas(filePath, cancelled));
          case schemaVersionStates.UPGRADE_PROTOCOL:
            return dispatch(upgradeProtocol(filePath, protocolSchemaVersion, toastUUID, cancelled));
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
    .then(() => dispatch(checkUnsavedChanges()))
    .then((proceed) => {
      if (!proceed) { return Promise.resolve({ canceled: true }); }

      if (netcanvasFilePath) {
        return Promise.resolve({ canceled: null, filePaths: [netcanvasFilePath] });
      }

      return openDialog();
    })
    .then(({ canceled, filePaths }) => dispatch(openOrUpgrade({ canceled, filePaths })))
    .catch((e) => dispatch(netcanvasFileErrorHandler(e, { filePath: netcanvasFilePath })));
};

const networkError = friendlyErrorMessage("We weren't able to fetch your protocol. Your device may not have an active network connection, or you may have mistyped the URL. Ensure you are connected to a network, double check your URL, and try again.");

const cancelledImport = () => Promise.reject(new CancellationError('Import cancelled.'));

const installProtocolFromURI = (uri) => (dispatch) => {
  let cancelled = false;
  let filePath;
  const toastUUID = uuid();
  const { dialog } = electron.remote;
  const tempPath = (electron.app || electron.remote.app).getPath('temp');
  const from = path.join(tempPath, 'SampleProtocol') + '.netcanvas';

  // Create a toast to show the status as it updates
  dispatch(toastActions.addToast({
    id: toastUUID,
    type: 'info',
    title: 'Importing Protocol...',
    CustomIcon: (<Spinner small />),
    autoDismiss: false,
    dismissHandler: () => {
      dispatch(toastActions.removeToast(toastUUID));
      dispatch(showCancellationToast());
      cancelled = true;
    },
    content: (
      <>
        <ProgressBar orientation="horizontal" percentProgress={10} />
      </>
    ),
  }));

  const selectPath = new Promise(function (resolve) {
    dialog.showOpenDialog(null, {
      properties: ['openDirectory'],
    })
      .then((result) => {
        if (cancelled) return cancelledImport();
        if (result.filePaths.toString() !== '') {
          dispatch(toastActions.updateToast(toastUUID, {
            title: 'Downloading Protocol...',
            dismissHandler: () => {
              dispatch(toastActions.removeToast(toastUUID));
              dispatch(showCancellationToast());
              cancelled = true;
            },
            content: (
              <>
                <ProgressBar orientation="horizontal" percentProgress={30} />
              </>
            ),
          }));
          const destination = path.join(result.filePaths.toString(), 'SampleProtocol') + '.netcanvas';
          resolve(destination);
        } else {
          dispatch(toastActions.removeToast(toastUUID));
          dispatch(showCancellationToast());
          cancelled = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return selectPath
    .then((destination) => {
      if (cancelled) return cancelledImport();
      const promisedResponse = fetch(uri)
        .then((response) => response.buffer());

      return promisedResponse
        .catch(networkError)
        .then((data) => {
          if (cancelled) return cancelledImport();
          dispatch(toastActions.updateToast(toastUUID, {
            title: 'Extracting to temporary storage...',
            content: (
              <>
                <ProgressBar orientation="horizontal" percentProgress={50} />
              </>
            ),
          }));
          writeFile(from, data);
        })
        .then(() => {
          if (cancelled) return cancelledImport();
          dispatch(toastActions.updateToast(toastUUID, {
            title: 'Extracting to destination storage...',
            content: (
              <>
                <ProgressBar orientation="horizontal" percentProgress={70} />
              </>
            ),
          }));
          rename(from, destination);
        })
        .then(() => {
          if (cancelled) return cancelledImport(destination);
          dispatch(toastActions.updateToast(toastUUID, {
            title: 'Validating and opening protocol...',
            dismissHandler: () => {
              dispatch(toastActions.removeToast(toastUUID));
              dispatch(showCancellationToast());
              cancelled = true;
            },
            content: (
              <>
                <ProgressBar orientation="horizontal" percentProgress={90} />
              </>
            ),
          }));
          return dispatch(openNetcanvas(destination, toastUUID, cancelled));
        })
        .then((result) => {
          if (result) {
            filePath = destination;
            if (cancelled) return cancelledImport();
            dispatch(toastActions.removeToast(toastUUID));
            dispatch(toastActions.addToast({
              type: 'success',
              title: 'Finished!',
              autoDismiss: true,
              content: (
                <>
                  <p>Protocol installed successfully.</p>
                </>
              ),
            }));
          }
          return null;
        })
        .catch((err) => {
          dispatch(toastActions.removeToast(toastUUID));
          if (filePath) {
            remove(filePath)
              .catch((removeErr) => {
                throw removeErr;
              });
          }
          console.log(err);
        });
    });
};

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

export const actionLocks = {
  loading: loadingLock,
  protocols: protocolsLock,
  saving: savingLock,
};

export const actionCreators = {
  openNetcanvas: protocolsLock(openNetcanvas), // loadingLock
  createNetcanvas: protocolsLock(createNetcanvas),
  saveAsNetcanvas: protocolsLock(saveAsNetcanvas), // savingLock
  saveNetcanvas: protocolsLock(savingLock(saveNetcanvas)), // savingLock
  installProtocolFromURI: installProtocolFromURI,
  printOverview,
};
