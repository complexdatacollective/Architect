import React from 'react';
import PropTypes from 'prop-types';

// const sectionVariants = {
//   initial: { opacity: 0, translateX: '50%' },
//   enter: {
//     opacity: 1,
//     translateX: 0,
//   },
// };

const Section = ({
  children,
  allowOverflow,
}) => {
  const styles = {
    overflow: allowOverflow ? 'visible' : 'hidden',
  };

  return (
    <div className="home-section" style={styles}>
      {children}
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  allowOverflow: PropTypes.bool,
};

Section.defaultProps = {
  children: null,
  allowOverflow: false,
};

export default Section;
