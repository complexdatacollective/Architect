import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Spinner } from '@codaco/ui';
import { getProtocol } from '@selectors/protocol';
import { actionCreators as protocolsActions, actionLocks as protocolsLocks } from '@modules/protocols';
import { selectors as statusSelectors } from '@modules/ui/status';
import ControlBar from './ControlBar';

const RightArrow = <Icon name="arrow-right" />;

const ProtocolControlBar = ({
  saveProtocol,
  hasUnsavedChanges,
  hasAnyStages,
  show,
  isSaving,
}) => {
  const saveProps = !isSaving &&
    {
      icon: RightArrow,
      iconPosition: 'right',
    };
  return (
    <ControlBar
      show={show && hasUnsavedChanges}
      buttons={[
        <Button
          onClick={saveProtocol}
          color="white"
          data-variant="save"
          disabled={!hasAnyStages || isSaving}
          {...saveProps}
        >
          {!isSaving && 'Save'}
          {isSaving && <Spinner /> }
        </Button>,
      ]}
    />
  );
};

ProtocolControlBar.propTypes = {
  saveProtocol: PropTypes.func.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  hasAnyStages: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  show: PropTypes.bool,
};

ProtocolControlBar.defaultProps = {
  show: true,
};

const mapStateToProps = state => ({
  hasUnsavedChanges: (
    state.session.lastChanged >
    state.session.lastSaved
  ),
  hasAnyStages: getProtocol(state).stages.length > 0,
  isSaving: statusSelectors.getIsBusy(state, protocolsLocks.saving),
});

const mapDispatchToProps = {
  saveProtocol: protocolsActions.saveAndBundleProtocol,
};

export { ProtocolControlBar };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtocolControlBar);
