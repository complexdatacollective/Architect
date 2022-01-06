import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Icon } from '@codaco/ui';

const DeleteButton = ({ onDelete }) => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: 90 }}
    className="list-delete-button"
    onClick={onDelete}
  >
    <Icon name="delete" />
  </motion.div>
);

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;
