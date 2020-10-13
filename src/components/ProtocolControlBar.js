import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import PropTypes from 'prop-types';
import history from '@app/history';
import { UnsavedChanges } from '@components/Dialogs';
import { Button, Spinner } from '@codaco/ui';
import { getProtocol } from '@selectors/protocol';
import { getHasUnsavedChanges } from '@selectors/session';
import { actionCreators as protocolsActions, actionLocks as protocolsLocks } from '@modules/protocols';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { selectors as statusSelectors } from '@modules/ui/status';
import logoutIcon from '@app/images/home/log-out.svg';
import ControlBar from './ControlBar';

const ProtocolControlBar = ({
  saveProtocol,
  isSaving,
  hasAnyStages,
  hasUnsavedChanges,
  handleClickStart,
}) => {
  const showSaveButton = hasAnyStages && hasUnsavedChanges;

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
        ...(showSaveButton ? [<Button
          key="save-button"
          onClick={saveProtocol}
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

ProtocolControlBar.propTypes = {
  saveProtocol: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  hasAnyStages: PropTypes.bool.isRequired,
  handleClickStart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const hasUnsavedChanges = getHasUnsavedChanges(state);
  const hasAnyStages = getProtocol(state).stages.length > 0;
  const isSaving = statusSelectors.getIsBusy(state, protocolsLocks.saving);

  return {
    isSaving,
    hasUnsavedChanges,
    hasAnyStages,
  };
};

const linkHandler = withHandlers({
  handleClickStart: ({
    hasUnsavedChanges,
    openDialog,
  }) =>
    () => Promise.resolve()
      .then(() => {
        if (!hasUnsavedChanges) { return true; }

        return openDialog(UnsavedChanges({
          message: (
            <div>
              Are you sure you want to go back to the start screen?
              <p><strong>Unsaved changes will be lost!</strong></p>
            </div>
          ),
          confirmLabel: 'Go to start screen',
        }));
      })
      .then((confirm) => {
        if (!confirm) { return; }
        history.push('/');
      }),
});

const mapDispatchToProps = {
  saveProtocol: protocolsActions.saveAndBundleProtocol,
  openDialog: dialogActions.openDialog,
};

export { ProtocolControlBar };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  linkHandler,
)(ProtocolControlBar);
