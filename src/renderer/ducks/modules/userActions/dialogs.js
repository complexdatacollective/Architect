import React from 'react';
import path from 'path';
import { Markdown } from '@codaco/ui/lib/components/Fields';
import { errors as netcanvasFileErrors } from '@app/utils/netcanvasFile';
import ExternalLink from '@components/ExternalLink';
import { actionCreators as dialogActions } from '@modules/dialogs';

const getFriendlyMessage = (e, meta = {}) => {
  const collectedMeta = {
    ...e.meta,
    ...meta,
  };

  const fileName = collectedMeta.filePath
    ? (<em>{path.basename(collectedMeta.filePath)}</em>)
    : 'file';

  switch (e.friendlyCode) {
    case netcanvasFileErrors.NotFound:
      return (
        <p>
          Could not find
          {' '}
          {fileName}
          . See the information below for details about
          why this error occurred.
        </p>
      );
    case netcanvasFileErrors.IncorrectPermissions:
      return (
        <>
          <p>
            Could not save/open &quot;
            {fileName}
            &quot; due to a permissions issue. Please
            check that the file is not &quot;read only&quot;.
          </p>
          <p>
            If you are attempting to save this file, you can try renaming it so
            that Architect can recreate the file when you save again.
          </p>
          <p>
            Please contact the Network Canvas team if you need support with
            this issue.
          </p>
        </>
      );
    case netcanvasFileErrors.ReadError:
      return (
        <p>
          Could not read the file &quot;
          {fileName}
          &quot;. See the information below
          for details about why this error occurred. Please contact the Network
          Canvas team if you need support with this issue.
        </p>
      );
    case netcanvasFileErrors.WriteError:
      return (
        <>
          <p>
            Saving failed because there was an error writing the file. Check that you have enough
            disk space, or try saving to a different location. The original file has not been
            changed. See the information below for details about why this error occurred.
          </p>
          <p>
            If you continue to encounter this error, please contact the Network Canvas team for
            support.
          </p>
        </>
      );
    case netcanvasFileErrors.CreateFailed:
      return (
        <p>
          Architect failed to create a new protocol file. This may mean
          it could not write to the temporary directory, or it could not read the template
          file. Please contact the Network Canvas team for support with this issue. See the
          information below for details about why this error occurred.
        </p>
      );
    case netcanvasFileErrors.SaveFailed:
      return (
        <>
          <p>
            Saving failed. Check that you have enough
            disk space, or try saving to a different location. The original file has not been
            changed. See the information below for details about why this error occurred.
          </p>
          <p>
            If you continue to encounter this error, please contact the Network Canvas team for
            support.
          </p>
        </>
      );
    case netcanvasFileErrors.OpenFailed:
      return (
        <>
          <p>
            Opening this protocol file failed. See the information below for details about why
            this error occurred.
          </p>
          <p>
            If you continue to encounter this error, please contact the Network Canvas team for
            support, including a copy of your protocol file.
          </p>
        </>
      );
    case netcanvasFileErrors.VerificationFailed:
      return (
        <p>
          Saving failed because the result could not be verified. Your original netcanvas file
          has not been changed. See the information below for details about why this error occurred.
        </p>
      );
    default:
      return null;
  }
};

const netcanvasFileErrorHandler = (e, meta = {}) => {
  const friendlyMessage = getFriendlyMessage(e, meta);

  if (friendlyMessage) { e.friendlyMessage = friendlyMessage; }

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

const importErrorDialog = (e) => {
  e.friendlyMessage = (
    <p>
      There was an error downloading or importing the sample protocol. Please consult the
      error message below for details. If you believe you have encountered a bug in the
      software, please help us to troubleshoot this issue by creating a topic on our&nbsp;
      <ExternalLink href="https://community.networkcanvas.com/">
        community website
      </ExternalLink>
      &nbsp;
      with further details.
    </p>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

const validationErrorDialog = (e) => {
  e.friendlyMessage = (
    <>
      <p>
        The protocol format seems to be invalid. Please help us to troubleshoot this issue
        by by creating a topic on our&nbsp;
        <ExternalLink href="https://community.networkcanvas.com/">
          community website
        </ExternalLink>
        &nbsp;
        with further details.
      </p>
      <p>
        You may still save and edit the protocol but it
        {' '}
        <strong>
          will not be compatible with
          Interviewer or Server
        </strong>
        .
      </p>
    </>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

const appUpgradeRequiredDialog = (protocolSchemaVersion) => {
  const message = (
    <>
      <p>This protocol is not compatible with the current version of Architect.</p>

      <p>
        In order to open it, you will need to install a version of Architect that
        supports schema version
        {' '}
        {protocolSchemaVersion}
        .
      </p>
      <p>
        Please see our
        {' '}
        <ExternalLink href="https://documentation.networkcanvas.com/reference/protocol-schema-information/">documentation on protocol schemas</ExternalLink>
        {' '}
        to locate an appropriate version, and for further information on this topic.
      </p>
    </>
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
    <>
      <p>
        This protocol uses schema version
        {' '}
        {protocolSchemaVersion}
        {', '}
        which is not compatible with
        this version of Architect.
      </p>
      <p>
        It can be automatically upgraded to schema version
        {' '}
        {targetSchemaVersion}
        {' '}
        using our migration feature, OR you can downgrade your version of
        Architect to continue editing this protocol without changing its schema version.
      </p>
      {migrationNotes.length > 0
        && (
          <>
            <p>
              If you choose to migrate, the following actions will be automatically
              performed on your protocol. Read these notes carefully, as these actions
              may affect your data.
            </p>
            <div className="migration-panel">
              {migrationNotes.map(({ version, notes }) => (
                <React.Fragment key={version}>
                  <h4>
                    Migrating to schema Version
                    {' '}
                    {version}
                    {' '}
                    will:
                  </h4>
                  <Markdown label={notes} markdownRenderers={{ a: ExternalLink }} />
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      <p>
        If you choose to continue, an upgraded copy of your protocol
        will be created and then opened. Your original protocol will not be changed,
        and can still be opened and modified using an older version of Architect. Please
        see our
        {' '}
        <ExternalLink href="https://documentation.networkcanvas.com/reference/protocol-schema-information/">documentation on protocol schemas</ExternalLink>
        {' '}
        for
        more information on this topic.
      </p>
    </>
  );

  return dialogActions.openDialog({
    type: 'Confirm',
    title: 'Upgrade to continue',
    confirmLabel: 'Create upgraded copy',
    message,
  });
};

export {
  netcanvasFileErrorHandler,
  importErrorDialog,
  validationErrorDialog,
  appUpgradeRequiredDialog,
  mayUpgradeProtocolDialog,
};
