import log from 'electron-log';
import React from 'react';
import path from 'path';
import { actionCreators as dialogActions } from '../dialogs';

export const migrateSchemaDialog = (callback) => {
  log.debug('migrate dialog');
  return dialogActions.openDialog({
    type: 'Confirm',
    title: 'Migrate',
    message: 'Migrate!',
    confirmLabel: 'Do it',
    onConfirm: callback,
  });
};

export const validationErrorDialog = (e) => {
  e.friendlyMessage = (
    <React.Fragment>
      <p>
        The protocol format seems to be invalid. Please help us to troubleshoot this issue
        by sharing your protocol file (or the steps to reproduce this problem) with us by
        emailing <code>info@networkcanvas.com</code>.
      </p>
      <p>
        You may still save and edit the protocol but it <strong>will not be compatable with
        Network Canvas or Server</strong>.
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const saveErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <p>
      <em>{path.basename(filePath)}</em> could not be saved. See
      the information below for details about why this error occured.
    </p>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const importErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <React.Fragment>
      <em>{path.basename(filePath)}</em> could not be imported.
    </React.Fragment>
  );
  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};
