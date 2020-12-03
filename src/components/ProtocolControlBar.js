import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UnsavedChanges } from '@components/Dialogs';
import { Button, Spinner } from '@codaco/ui';
import { getProtocol } from '@selectors/protocol';
import { getHasUnsavedChanges } from '@selectors/session';
import validateProtocol from '@app/utils/validateProtocol';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionCreators as userActions, actionLocks as protocolsLocks } from '@modules/userActions';
import { actionCreators as sessionActions } from '@modules/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import logoutIcon from '@app/images/home/log-out.svg';
import ControlBar from '@components/ControlBar';

const unsavedChangesDialog = UnsavedChanges({
  message: (
    <div>
      Are you sure you want to go back to the start screen?
      <p><strong>Unsaved changes will be lost!</strong></p>
    </div>
  ),
  confirmLabel: 'Go to start screen',
});

const ProtocolControlBar = () => {
  const dispatch = useDispatch();

  const hasUnsavedChanges = useSelector(state => getHasUnsavedChanges(state));
  const isSaving = useSelector(state => statusSelectors.getIsBusy(state, protocolsLocks.saving));
  const protocol = useSelector(state => getProtocol(state));

  const saveNetcanvas = useCallback(() => dispatch(userActions.saveNetcanvas()), [dispatch]);

  const handleClickStart = useCallback(
    () => Promise.resolve()
      .then(() => {
        if (!hasUnsavedChanges) { return true; }

        return dispatch(dialogActions.openDialog(unsavedChangesDialog));
      })
      .then((confirm) => {
        if (!confirm) { return; }
        dispatch(sessionActions.resetSession());
      }),
    [dispatch, hasUnsavedChanges],
  );

  const [protocolIsValid, setProtocolIsValid] = useState(false);

  useEffect(() => {
    validateProtocol(protocol)
      .then(() => { setProtocolIsValid(true); })
      .catch(() => { setProtocolIsValid(false); });
  }, [protocol]);

  return (
    <ControlBar
      show
      secondaryButtons={[
        <Button
          key="return-button"
          icon={<div><img src={logoutIcon} alt="Return to start screen" /></div>}
          color="platinum"
          onClick={handleClickStart}
        >
          Return to start screen
        </Button>,
      ]}
      buttons={[
        ...(protocolIsValid && hasUnsavedChanges ? [<Button
          key="save-button"
          onClick={saveNetcanvas}
          color="primary"
          data-variant="save"
          disabled={isSaving}
          content={isSaving ? 'Saving...' : 'Save Changes'}
          iconPosition="right"
          icon={isSaving ? <div><Spinner size="0.5rem" /></div> : 'arrow-right'}
        />] : []),
      ]}
    />
  );
};

export default ProtocolControlBar;
