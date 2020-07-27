import React from 'react';
import PropTypes from 'prop-types';

const Group = ({
  children,
  color,
  roundedCorners,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
    borderRadius: roundedCorners
      .map(rounded => (rounded ? 'var(--border-radius)' : '0'))
      .join(' '),
  };

  return (
    <div className="home-group" style={styles}>
      {children}
    </div>
  );
};

Group.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  roundedCorners: PropTypes.array,
};

Group.defaultProps = {
  children: null,
  color: 'platinum--dark',
  roundedCorners: [false, false, false, false],
};

export default Group;
