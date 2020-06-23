import React from 'react';
import path from 'path';
import Markdown from 'react-markdown';
import { actionCreators as dialogActions } from '../dialogs';

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
  const error = e || new Error('An unknown error occured.');
  error.friendlyMessage = (
    <React.Fragment>
      <em>{path.basename(filePath)}</em> could not be imported.
    </React.Fragment>
  );
  return dialogActions.openDialog({
    type: 'Error',
    error,
  });
};

export const appUpgradeRequiredDialog = (protocol) => {
  const message = (
    <React.Fragment>
      <p>This protocol is not compatible with the current version of Architect.</p>

      <p>In order to open it, you will need to install a version of Architect that
        supports schema version {protocol.schemaVersion}.</p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'UserError',
    title: 'Protocol not compatible with current version',
    message,
  });
};

export const mayUpgradeProtocolDialog = (
  protocolSchemaVersion,
  targetSchemaVersion,
  migrationNotes = [],
) => {
  const message = (
    <React.Fragment>
      <p>This protocol uses an out-dated schema
      (schema version &quot;{protocolSchemaVersion}&quot;),
      but can be upgraded to work with this version of Architect
      (schema version &quot;{targetSchemaVersion}&quot;).</p>

      <p>An upgraded copy of the protocol will be created and then opened.</p>

      { migrationNotes.length > 0 &&
        <React.Fragment>
          <p>Information for specific migration changes are shown below:</p>
          {migrationNotes.map(({ version, notes }) => (
            <React.Fragment key={version}>
              <h4>Schema Version {version}</h4>
              <Markdown source={notes} />
            </React.Fragment>
          ))}
        </React.Fragment>
      }
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Confirm',
    title: 'Would you like to upgrade the protocol?',
    confirmLabel: 'Create upgraded copy',
    message,
  });
};
