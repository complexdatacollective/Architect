import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter, NavLink } from 'react-router-dom';
import { isMacOS } from '../utils/platform';
import architectLogoIcon from '../images/architect-logo-icon.svg';
import Version from './Version';

const isAtIndex = pathname => pathname === '/';

const App = ({ children, location: { pathname } }) => {
  const appClasses = cx(
    'app',
    {
      'app--start': isAtIndex(pathname),
      'app--macos': isMacOS(),
    },
  );

  return (
    <div className={appClasses}>
      {isMacOS() &&
        <div className="app__electron-titlebar" />
      }
      <NavLink className="app__home" to="/" exact>
        <img src={architectLogoIcon} alt="" />
      </NavLink>
      <div className="app__window">
        { children }
      </div>
      <Version />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object.isRequired,
};

App.defaultProps = {
  children: null,
};

export { App };

export default compose(
  withRouter,
)(App);
