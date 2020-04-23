import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Button, Icon, Spinner } from '@codaco/ui';
import { getProtocol } from '@selectors/protocol';
import { actionCreators as protocolsActions, actionLocks as protocolsLocks } from '@modules/protocols';
import { selectors as statusSelectors } from '@modules/ui/status';
import ControlBar from './ControlBar';

const RightArrow = <Icon name="arrow-right" />;

const labelVariants = {
  ready: { opacity: 1 },
  busy: { opacity: 0 },
};

const spinnerVariants = {
  ready: { opacity: 0 },
  busy: { opacity: 1 },
};

const ProtocolControlBar = ({
  saveProtocol,
  show,
  showControlBar,
  isDisabled,
  isSaving,
}) => {
  const saveProps = !isSaving &&
  {
    icon: RightArrow,
    iconPosition: 'right',
  };

  return (
    <ControlBar
      show={show && showControlBar}
      buttons={[
        <Button
          onClick={saveProtocol}
          color="white"
          data-variant="save"
          disabled={isDisabled}
          {...saveProps}
        >
          <motion.div
            initial="ready"
            animate={isSaving ? 'busy' : 'ready'}
          >
            <motion.div variants={labelVariants}>Save</motion.div>
            <motion.div className="button__busy" variants={spinnerVariants}><Spinner /></motion.div>
          </motion.div>
        </Button>,
      ]}
    />
  );
};

ProtocolControlBar.propTypes = {
  saveProtocol: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  showControlBar: PropTypes.bool.isRequired,
  show: PropTypes.bool,
};

ProtocolControlBar.defaultProps = {
  show: true,
};

const mapStateToProps = (state) => {
  const hasUnsavedChanges = state.session.lastChanged > state.session.lastSaved;
  const hasAnyStages = getProtocol(state).stages.length > 0;
  const isSaving = statusSelectors.getIsBusy(state, protocolsLocks.saving);
  const isDisabled = !hasAnyStages || isSaving;
  const showControlBar = hasUnsavedChanges || isSaving;

  return {
    isSaving,
    isDisabled,
    showControlBar,
  };
};

const mapDispatchToProps = {
  saveProtocol: protocolsActions.saveAndBundleProtocol,
};

export { ProtocolControlBar };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtocolControlBar);
