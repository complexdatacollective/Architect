import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, translateY: '5rem' },
  animate: { opacity: 1, translateY: '0rem', transition: { duration: 1 } },
  exit: { opacity: 0 }, // transforms aren't compatible with layout animation
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
      variants={variants}
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
