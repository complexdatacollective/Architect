import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const ControlBar = ({ children, show, className }) => (
  <div
    className={cx(
      'control-bar',
      { 'control-bar--show': show },
      className,
    )}
  >
    { children }
  </div>
);

ControlBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  show: PropTypes.boolean,
};

ControlBar.defaultProps = {
  children: null,
  className: '',
  show: true,
};

export { ControlBar };

export default ControlBar;
