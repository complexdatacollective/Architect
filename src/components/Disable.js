import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Disable = ({
  disabled, className, children, ...rest
}) => (
  <div
    className={cx(
      'disable',
      { 'disable--disabled': disabled },
      className,
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    <div className="disable__capture">
      {children}
    </div>
  </div>
);

Disable.defaultProps = {
  disabled: true,
  children: null,
  className: '',
};

Disable.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Disable;
