import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

require('../styles/main.scss');

/**
  * Main app container.
  * @param props {object} - children
  */
const App = props => (
  <div className={cx({
    app: true,
  })}
  >
    { props.children }
  </div>

);

App.propTypes = {
  children: PropTypes.any,
};

App.defaultProps = {
  children: null,
};

export default App;
