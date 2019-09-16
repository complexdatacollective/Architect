import React from 'react';
import path from 'path';
import { actionCreators as dialogActions } from 'App/ducks/modules/dialogs';

export const invalidAssetErrorDialog = (filePath) => {
  const friendlyMessage = (
    <React.Fragment>
      <p>
        This network file is not formatted correctly.
      </p>
      <p>
        <strong>Reminder:</strong> Network Canvas supports importing network data in
        either JSON or CSV format. JSON files must contain a &quot;nodes&quot; and/or
        &quot;edges&quot; list in the root object, and CSV data should contain a header
        row comprising variable names, and be in the format of a node or edge list.
      </p>
      <p>
        If you believe you are seeing this message in error, please help us to
        troubleshoot the issue by sharing the network file with us at&nbsp;
        <code>info@networkcanvas.com</code>.
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'UserError',
    title: `Error: ${path.basename(filePath)} is not formatted correctly`,
    message: friendlyMessage,
  });
};

export const unsupportedAssetErrorDialog = () => {
  const friendlyMessage = (
    <React.Fragment>
      <p>
        The file you attmpted to import is not in a format supported by Network
        Canvas. For a list of supported file formats, please refer to our
        documentation website.
      </p>
      <p>
        If you believe you are seeing this message in error, please help us to
        troubleshoot the issue by sharing your asset file with us at&nbsp;
        <code>info@networkcanvas.com</code>.
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'UserError',
    title: 'Error: Unsupported file type',
    message: friendlyMessage,
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
