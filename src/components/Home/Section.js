import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';

// transforms aren't compatible with layout animation TODO link to docs
const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1, when: 'beforeChildren' } },
  exit: { opacity: 0 },
};

const Section = ({
  children,
  allowOverflow,
}) => {
  const classes = cx(
    'home-section',
    { 'home-section--allow-overflow': allowOverflow },
  );

  return (
    <motion.div
      className={classes}
      variants={variants}
      layout
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
