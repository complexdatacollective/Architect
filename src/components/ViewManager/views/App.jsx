import React from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import { isMacOS } from '@app/utils/platform';
import { AppErrorBoundary } from '@components/Errors';
import DialogManager from '@components/DialogManager';
import Routes from '@components/Routes';
import ToastManager from '@components/ToastManager';
import useUpdater from '@hooks/useUpdater';

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

const AppView = () => {
  const appClasses = cx(
    'app',
    {
      'app--macos': isMacOS(),
    },
  );

  useUpdater('https://api.github.com/repos/complexdatacollective/Architect/releases/latest', 2500);

  return (
    <>
      {isMacOS()
        && <div className="electron-titlebar" />}
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
    </>
  );
};

export default AppView;
