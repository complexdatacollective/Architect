import React from 'react';
import path from 'path';
import Markdown from 'react-markdown';
import { errors as netcanvasFileErrors } from '@app/utils/netcanvasFile';
import ExternalLink from '@components/ExternalLink';
import { actionCreators as dialogActions } from '@modules/dialogs';

// File couldn't be saved
// File couldn't be opened
// Backup couldn't be created
// File didn't have write access
// File was corrupted
// Protocol could not be validated
// Save could not be verified as successful
// Protocol could not be created.

const getFriendlyMessage = (e) => {
  switch (e) {
    case netcanvasFileErrors.CreateTemplateFailed:
      return (<p>New protocol could not be created</p>);
    case netcanvasFileErrors.MissingSchemaVersion:
      return (<p>Schema version not defined in protocol</p>);
    case netcanvasFileErrors.MissingPermissions:
      return (<p>Netcanvas file does not have write permissions, changes will not be savable, so file was not opened</p>);
    case netcanvasFileErrors.ExtractFailed:
      return (<p>Netcanvas file could not be opened, it may be corrupted</p>);
    case netcanvasFileErrors.BackupFailed:
      return (<p>Netcanvas backup could not be created, save aborted, original file unchanged</p>);
    case netcanvasFileErrors.SaveFailed:
      return (<p>Protocol data could not be saved</p>);
    case netcanvasFileErrors.ArchiveFailed:
      return (<p>Netcanvas file could not be created</p>); // same as SaveFailed?
    case netcanvasFileErrors.DeployFailed:
      return (<p>Deployment failed, final file could not be moved</p>);
    case netcanvasFileErrors.MissingProtocolJson:
      return (<p>Protocol does not have a json file</p>); // TODO not suitable for user?
    case netcanvasFileErrors.ProtocolJsonParseError:
      return (<p>Protocol json could not be parsed</p>);
    case netcanvasFileErrors.NetcanvasCouldNotValidate:
      return (<p>Netcanvas file could not be validated</p>);
    case netcanvasFileErrors.NetcanvasVerificationError:
      return (<p>Netcanvas file could not be verifed</p>);
    default:
      return null;
  }
};

const fileErrorHandler = (e) => {
  const friendlyMessage = getFriendlyMessage(e);

  if (friendlyMessage) { e.friendlyMessage = friendlyMessage; }

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

const validationErrorDialog = (e) => {
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

const saveErrorDialog = (e, filePath) => {
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

const writeErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <React.Fragment>
      <p>
        <em>{path.basename(filePath)}</em> could not be saved due to a permissions issue.
      </p>
      <p>
        <ol>
          <li>Please check that the file is not &quot;read only&quot;</li>
          <li>Rename the original file and Architect will recreate it</li>
        </ol>
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

const importErrorDialog = (e, filePath) => {
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

const appUpgradeRequiredDialog = (protocolSchemaVersion) => {
  const message = (
    <React.Fragment>
      <p>This protocol is not compatible with the current version of Architect.</p>

      <p>In order to open it, you will need to install a version of Architect that
        supports schema version {protocolSchemaVersion}.
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

const mayUpgradeProtocolDialog = (
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

export {
  fileErrorHandler,
  validationErrorDialog,
  appUpgradeRequiredDialog,
  saveErrorDialog,
  writeErrorDialog,
  importErrorDialog,
  mayUpgradeProtocolDialog,
};
