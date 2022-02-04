import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';

const springy = {
  show: {
    opacity: 1,
    y: '0rem',
    transition: {
      type: 'spring',
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
    y: '5rem',
  },
  exit: {
    opacity: 0,
    x: '100%',
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
      variants={springy}
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
  className: null,
};

export default Section;
