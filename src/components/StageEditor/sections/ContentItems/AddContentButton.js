import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../../ui/components';

const AddContentButton = ({ onClick, type, children }) => (
  <Button
    type="button"
    size="small"
    className={`button button--small stage-editor-section-content-items__control stage-editor-section-content-items__control--${type}`}
    onClick={onClick}
  >
    {children}
  </Button>
);

AddContentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AddContentButton;
