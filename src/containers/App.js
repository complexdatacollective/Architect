import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter, NavLink } from 'react-router-dom';

const isAtIndex = pathname => pathname === '/';

const App = ({ children, location: { pathname } }) => {
  const appClasses = cx(
    'app',
    {
      'app--start': isAtIndex(pathname),
    },
  );

  return (
    <div className={appClasses}>
      <NavLink className="app__home" to="/" exact />
      { children }
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
