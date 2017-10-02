import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Start = props => (
  <div className={cx({
    app: true,
  })}
  >
    { props.children }
  </div>

);

Start.propTypes = {
  children: PropTypes.any,
};

Start.defaultProps = {
  children: null,
};

export default Start;
