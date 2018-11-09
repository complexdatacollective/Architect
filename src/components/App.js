import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { isMacOS } from '../utils/platform';
import { AppErrorBoundary } from './Errors';
import DialogManager from './DialogManager';

const App = ({ children }) => {
  const appClasses = cx(
    'app',
    {
      'app--macos': isMacOS(),
    },
  );

  return (
    <div className={appClasses}>
      {isMacOS() &&
        <div className="app__electron-titlebar" />
      }
      <div className="app__window">
        <AppErrorBoundary>
          { children }
        </AppErrorBoundary>
      </div>

      <DialogManager />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element,
};

App.defaultProps = {
  children: null,
};

export { App };

export default compose(
  withRouter,
)(App);
