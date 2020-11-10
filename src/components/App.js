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
import ToastManager from './ToastManager';
import useUpdater from '../hooks/useUpdater';

const appVariants = {
  show: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
  },
};

const App = () => {
  const appClasses = cx(
    'app',
    {
      'app--macos': isMacOS(),
    },
  );

  useUpdater('https://api.github.com/repos/complexdatacollective/Architect/releases/latest', 2500);

  return (
    <React.Fragment>
      {isMacOS() &&
        <div className="electron-titlebar" />
      }
      <motion.div
        className={appClasses}
        variants={appVariants}
        initial="hide"
        animate="show"
      >
        <AppErrorBoundary>
          <Routes />
        </AppErrorBoundary>
      </motion.div>
      <DialogManager />
      <ToastManager />
    </React.Fragment>
  );
};

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export { App };

export default compose(
  withRouter,
)(App);
