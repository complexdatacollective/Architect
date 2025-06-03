import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { motion, useElementScroll } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { getHasUnsavedChanges } from '@selectors/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionLocks as protocolsLocks } from '@modules/userActions';
import Overview from '@components/Overview';
import Timeline from '@components/Timeline';
import ProtocolControlBar from '@components/ProtocolControlBar';

const Protocol = ({
  isLoading,
  hasProtocol,
}) => {
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

  const ref = useRef(null);
  const { scrollY } = useElementScroll(ref);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    scrollY.onChange((value) => setScrollOffset(value));
  }, [scrollY]);

  return (
    <motion.div
      className={sceneClasses}
      variants={variants}
    >
      <div className="scene__protocol" ref={ref}>
        <Overview
          scrollOffset={scrollOffset}
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
};

Protocol.defaultProps = {
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

export default withStore(Protocol);
