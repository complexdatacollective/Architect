import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import cx from 'classnames';

require('../styles/main.scss');

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
      <div className="app__title-bar">
        Architect app
      </div>
      { children }
    </div>

  );
};

App.propTypes = {
  children: PropTypes.any,
  location: PropTypes.any.isRequired,
};

App.defaultProps = {
  children: null,
};

export { App };
export default withRouter(App);
