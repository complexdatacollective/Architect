import React from 'react'; import path from 'path';
import { actionCreators as dialogActions } from '@modules/dialogs';
import ExternalLink from '@components/ExternalLink';
import { Button } from '@codaco/ui';

const genericAssetMessage = (
  <>
    <p>
      Please see our
      {' '}
      <ExternalLink
        href="https://documentation.networkcanvas.com/docs/key-concepts/assets/#supported-file-types"
      >
        documentation page
      </ExternalLink>
      {' '}
      on using external data by clicking
      the button below.
    </p>
    <p>
      If you believe you are seeing this message in error, please help us to
      troubleshoot the issue by sharing the asset file with us at&nbsp;
      <ExternalLink href="mailto:info@networkcanvas.com">
        <code>info@networkcanvas.com</code>
      </ExternalLink>
      .
    </p>
    <p>
      <ExternalLink href="https://documentation.networkcanvas.com/docs/key-concepts/assets/#supported-file-types">
        <Button size="small">view documentation</Button>
      </ExternalLink>
    </p>
  </>
);

const assetErrorMessages = {
  VARIABLE_NAME: (
    <>
      <p>
        The file you attempted to import contained invalid variable names.
      </p>
      {genericAssetMessage}
    </>
  ),
  COLUMN_MISMATCHED: (
    <>
      <p>
        The file you attempted to import contained data with a different number of
        columns to the header row.
      </p>
      {genericAssetMessage}
    </>
  ),
  default: (
    <>
      <p>
        The file you attempted to import is not in a format supported by
        Interviewer.
      </p>
      {genericAssetMessage}
    </>
  ),
};

export const invalidAssetErrorDialog = (e, filePath) => {
  e.friendlyMessage = assetErrorMessages[e.code] || assetErrorMessages.default;

  return dialogActions.openDialog({
    type: 'Error',
    title: `Error: ${path.basename(filePath)} is not formatted correctly`,
    error: e,
  });
};

export const importAssetErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <>
      The file
      {' '}
      <strong>{path.basename(filePath)}</strong>
      {' '}
      could not be imported.
    </>
  );
  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};
