import React from 'react';
import path from 'path';
import { actionCreators as dialogActions } from 'App/ducks/modules/dialogs';

export const invalidAssetErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <React.Fragment>
      <p>
        The imported asset <em>{path.basename(filePath)}</em> seems to be invalid.
        Please help us to troubleshoot this issue by sharing the asset file (or
        the steps to reproduce this problem) with us by emailing
        <code>info@networkcanvas.com</code>.
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const importAssetErrorDialog = (e, filePath) => {
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
