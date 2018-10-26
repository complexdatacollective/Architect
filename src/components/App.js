import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { isMacOS } from '../utils/platform';
import { AppErrorBoundary } from './Errors';
import DialogManager from './DialogManager';
import Version from './Version';

const App = ({ children, location }) => {
  const isPreview = /^\/preview/.test(location.pathname);

  const appClasses = cx(
    'app',
    {
      'app--macos': isMacOS(),
      'app--preview': isPreview,
    },
  );

  return (
    <div className={appClasses}>
      {(isMacOS() || isPreview) &&
        <div className="app__electron-titlebar" />
      }
      <div className="app__window">
        <AppErrorBoundary>
          { children }
        </AppErrorBoundary>
      </div>
      <div id="page-wrap" />

      <DialogManager />
      <Version />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element,
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
