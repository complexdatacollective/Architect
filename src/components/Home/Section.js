import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const sectionVariants = {
  initial: { opacity: 0, translateX: '50%' },
  enter: {
    opacity: 1,
    translateX: 0,
  },
};

const Section = ({
  children,
  allowOverflow,
}) => {
  const styles = {
    overflow: allowOverflow ? 'visible' : 'hidden',
  };

  return (
    <motion.div
      className="home-section"
      style={styles}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
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
