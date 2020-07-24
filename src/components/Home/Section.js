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
    <div className="home-section" style={styles}>
      {children}
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  graphic: PropTypes.string,
  graphicPosition: PropTypes.string,
  graphicSize: PropTypes.string,
};

Section.defaultProps = {
  children: null,
  color: 'platinum--dark',
  graphic: null,
  graphicPosition: '50% 50%',
  graphicSize: 'contain',
};

export default Section;
