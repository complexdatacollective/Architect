import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getActiveProtocolMeta } from '../selectors/protocol';
import { Button, Icon } from '../ui/components';
import ControlBar from './ControlBar';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

const RightArrow = <Icon name="arrow-right" />;

const ProtocolControlBar = ({
  saveProtocol,
  hasUnsavedChanges,
  show,
}) => (
  <ControlBar show={show && hasUnsavedChanges}>
    <Button
      size="small"
      onClick={saveProtocol}
      color="white"
      icon={RightArrow}
      iconPosition="right"
    >
      Save
    </Button>
  </ControlBar>
);

ProtocolControlBar.propTypes = {
  saveProtocol: PropTypes.func.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  show: PropTypes.bool,
};

ProtocolControlBar.defaultProps = {
  show: true,
};

const mapStateToProps = state => ({
  protocolMeta: getActiveProtocolMeta(state),
  hasUnsavedChanges: (state.session.lastChanged > state.session.lastSaved),
});

const mapDispatchToProps = dispatch => ({
  saveProtocol: bindActionCreators(protocolsActions.saveAndExportProtocol, dispatch),
});

export { ProtocolControlBar };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtocolControlBar);
