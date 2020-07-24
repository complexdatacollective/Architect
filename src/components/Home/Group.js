import React from 'react';
import PropTypes from 'prop-types';

const Group = ({
  children,
  color,
  graphic,
  graphicPosition,
  graphicSize,
}) => {
  const styles = {
    backgroundColor: `var(--color-${color})`,
    backgroundImage: `url(${graphic})`,
    backgroundPosition: graphicPosition,
    backgroundSize: graphicSize,
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
  graphic: PropTypes.string,
  graphicPosition: PropTypes.string,
  graphicSize: PropTypes.string,
};

Group.defaultProps = {
  children: null,
  color: 'platinum--dark',
  graphic: null,
  graphicPosition: '50% 50%',
  graphicSize: 'contain',
};

export default Group;
