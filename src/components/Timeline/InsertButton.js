import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const InsertButton = ({ onClick }) => (
  <motion.div
    className="timeline__insert"
    onClick={onClick}
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1 }}
    // exit={{ opacity: 0 }}
  >
    Add stage here
  </motion.div>
);

InsertButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default InsertButton;
