import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@codaco/ui';
import { selectors as statusSelectors } from '@modules/ui/status';
import { actionLocks as protocolsLocks } from '@modules/userActions';

const variants = {
  hidden: { opacity: 0, transition: { delay: 0.5, duration: 0.5 } },
  visible: { opacity: 1, transition: { delay: 0.5 } },
};

const Loading = ({
  isLoading,
}) => (
  <AnimatePresence>
    { isLoading
      && (
      <motion.div
        className="scene__loading"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 'var(--z-dialog)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
      >
        <Spinner />
      </motion.div>
      )}
  </AnimatePresence>
);

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isLoading: statusSelectors.getIsBusy(state, protocolsLocks.loading),
});

const withState = connect(mapStateToProps);

export default withState(Loading);
