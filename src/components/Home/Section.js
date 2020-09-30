import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';

const springy = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
    y: '5rem',
  },
};

const Section = ({
  children,
  className,
}) => {
  const classes = cx(
    'home-section',
    className,
  );

  return (
    <motion.div
      className={classes}
      initial="hide"
      exit="hide"
      variants={springy}
      layout
    >
      {children}
    </motion.div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Section.defaultProps = {
  children: null,
  allowOverflow: false,
  className: null,
};

export default Section;
