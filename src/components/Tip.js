import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';

const Tip = ({ type, icon, children }) => {
  const classes = cx('tip', `tip__${type}`);

  return (
    <div className={classes}>
      { icon
        && <Icon name={type} />}
      {children}
    </div>
  );
};

Tip.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'error']),
  icon: PropTypes.bool,
  children: PropTypes.node,
};

Tip.defaultProps = {
  type: 'info',
  icon: true,
  children: null,
};

export default Tip;
