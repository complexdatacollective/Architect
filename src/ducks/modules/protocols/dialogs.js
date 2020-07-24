import React from 'react';
import path from 'path';
import Markdown from 'react-markdown';
import ExternalLink from '@components/ExternalLink';
import { actionCreators as dialogActions } from '@modules/dialogs';

export const validationErrorDialog = (e) => {
  e.friendlyMessage = (
    <React.Fragment>
      <p>
        The protocol format seems to be invalid. Please help us to troubleshoot this issue
        by sharing your protocol file (or the steps to reproduce this problem) with us by
        emailing <code>info@networkcanvas.com</code>.
      </p>
      <p>
        You may still save and edit the protocol but it <strong>
          will not be compatable with
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
      the information below for details about why this error occurred.
    </p>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const importErrorDialog = (e, filePath) => {
  const error = e || new Error('An unknown error occurred.');
  error.friendlyMessage = (
    <React.Fragment>
      The file <strong>{path.basename(filePath)}</strong> could not be imported.
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
        supports schema version {protocol.schemaVersion}.
      </p>
      <p>
        Please see our <ExternalLink href="https://documentation.networkcanvas.com/docs/technical-documentation/protocol-schema-information/">documentation on protocol schemas</ExternalLink>
        to locate an appropriate version, and for further information on this topic.
      </p>
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
      <p>
        This protocol uses an older schema version
        (<strong>version {protocolSchemaVersion}</strong>) that is not compatible with
        this version of Architect. It can be automatically upgraded
        to schema <strong>version {targetSchemaVersion}</strong> using our migration feature.
      </p>
      { migrationNotes.length > 0 &&
        <React.Fragment>
          <p>
            Read the following notes about this migration carefully, as these actions
            may affect your data.
          </p>
          <div className="migration-panel">
            {migrationNotes.map(({ version, notes }) => (
              <React.Fragment key={version}>
                <h4>Migrating to schema Version {version} will:</h4>
                <Markdown source={notes} renderers={{ link: ExternalLink }} />
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      }
      <p>
        If you choose to continue, an upgraded copy of your protocol
        will be created and then opened. Your original protocol will not be changed,
        and can still be opened and modified using an older version of Architect. Please
        see our <ExternalLink href="https://documentation.networkcanvas.com/docs/technical-documentation/protocol-schema-information/">documentation on protocol schemas</ExternalLink> for
        more information on this topic.
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Confirm',
    title: 'Upgrade to continue',
    confirmLabel: 'Create upgraded copy',
    message,
  });
};
