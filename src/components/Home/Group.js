import React from 'react';
import PropTypes from 'prop-types';

const Group = ({
  children,
  color,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
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
};

Group.defaultProps = {
  children: null,
  color: null,
};

export default Group;
