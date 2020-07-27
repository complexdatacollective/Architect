import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Group = ({
  children,
  color,
  className,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
  };

  const classes = cx('home-group', className);

  return (
    <div className={classes} style={styles}>
      {children}
    </div>
  );
};

Group.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  className: PropTypes.string,
};

Group.defaultProps = {
  children: null,
  color: 'platinum--dark',
  className: null,
};

export default Group;
