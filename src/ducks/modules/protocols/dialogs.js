import React from 'react';
import path from 'path';
import { actionCreators as dialogActions } from '../dialogs';

export const saveErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <React.Fragment>
      <strong><em>{path.basename(filePath)}</em></strong> could not be saved.
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const importErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <React.Fragment>
      <strong><em>{path.basename(filePath)}</em></strong> could not be imported.
    </React.Fragment>
  );
  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};
