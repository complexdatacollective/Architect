import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { getHasUnsavedChanges } from '@selectors/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionLocks as protocolsLocks } from '@modules/userActions';
import { actionCreators as sessionActions } from '@modules/session';
import Overview from '@components/Overview';
import Timeline from '@components/Timeline';
import ProtocolControlBar from '@components/ProtocolControlBar';

const Protocol = ({
  isLoading,
  hasProtocol,
  protocolPath,
}) => {
  const dispatch = useDispatch();
  useEffect(() =>
    () => dispatch(sessionActions.resetSession()),
  [protocolPath]);

  const sceneClasses = cx(
    'scene',
    { 'scene--protocol': hasProtocol },
    { 'scene--loading': isLoading },
  );

  const variants = {
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    hide: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      className={sceneClasses}
      variants={variants}
    >
      <div className="scene__protocol">
        <Overview
          show={hasProtocol}
        />
        <Timeline show={hasProtocol} />
      </div>
      <ProtocolControlBar show={hasProtocol} />
    </motion.div>
  );
};

Protocol.propTypes = {
  isLoading: PropTypes.bool,
  hasProtocol: PropTypes.bool,
  protocolPath: PropTypes.string,
};

Protocol.defaultProps = {
  protocolPath: null,
  isLoading: false,
  hasProtocol: false,
};

const mapStateToProps = (state) => {
  const activeProtocol = state.session.filePath;

  return {
    hasUnsavedChanges: getHasUnsavedChanges(state),
    protocolPath: activeProtocol,
    hasProtocol: !!activeProtocol,
    isLoading: statusSelectors.getIsBusy(state, protocolsLocks.loading),
  };
};

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
};

const withStore = connect(mapStateToProps, mapDispatchToProps);

export { Protocol };

export default withStore(Protocol);
