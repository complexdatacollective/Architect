import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Disable = ({ disabled, children, ...rest }) => (
  <div className={cx('disable', { 'disable--disabled': disabled })} {...rest}>
    <div className="disable__capture">
      {children}
    </div>
  </div>
);

Disable.defaultProps = {
  disabled: true,
  children: null,
};

Disable.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Disable;
