import React from 'react';
import { motion } from 'framer-motion';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { isMacOS } from '@app/utils/platform';
import { AppErrorBoundary } from '@components/Errors';
import DialogManager from '@components/DialogManager';
import Routes from '@components/Routes';

const appVariants = {
  visible: { opacity: 1, duration: 2 },
  hidden: { opacity: 0, duration: 2 },
};

const App = () => {
  const appClasses = cx(
    'app',
    {
      'app--macos': isMacOS(),
    },
  );

  // we can use location and history for router

  return (
    <React.Fragment>
      {isMacOS() &&
        <div className="electron-titlebar" />
      }
      <motion.div
        className={appClasses}
        variants={appVariants}
        initial="hidden"
        animate="visible"
      >
        <AppErrorBoundary>
          <Routes />
        </AppErrorBoundary>
      </motion.div>
      <DialogManager />
    </React.Fragment>
  );
};

App.propTypes = {
  // children: PropTypes.element,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  children: null,
};

export { App };

export default compose(
  withRouter,
)(App);
