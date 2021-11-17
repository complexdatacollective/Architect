import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UnsavedChanges } from '@components/Dialogs';
import { Button, Spinner } from '@codaco/ui';
import { getHasUnsavedChanges, getIsProtocolValid } from '@selectors/session';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionCreators as userActions, actionLocks as protocolsLocks } from '@modules/userActions';
import { actionCreators as sessionActions } from '@modules/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import logoutIcon from '@app/images/home/log-out.svg';
import ControlBar from '@components/ControlBar';

const unsavedChangesDialog = UnsavedChanges({
  message: (
    <p>
      Your protocol has changes that have not yet been saved. Continuing will
      discard these changes!
    </p>
  ),
  confirmLabel: 'Discard Changes',
});

const ProtocolControlBar = () => {
  const dispatch = useDispatch();

  const hasUnsavedChanges = useSelector((state) => getHasUnsavedChanges(state));
  const isSaving = useSelector((state) => statusSelectors.getIsBusy(state, protocolsLocks.saving));
  const protocolIsValid = useSelector((state) => getIsProtocolValid(state));
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

  return (
    <ControlBar
      show
      secondaryButtons={[
        <Button
          key="return-button"
          color="platinum"
          icon={<div><img src={logoutIcon} alt="Return to start screen" /></div>}
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
