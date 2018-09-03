import React from 'react';
import PropTypes from 'prop-types';

const VariablePreview = ({ variable, value, onDelete }) => (
  <div className="variable__preview">
    <div className="variable__preview-name">{variable}</div>
    <div className="variable__preview-value">{value}</div>
    <div className="variable__preview-control" onClick={onDelete}>x</div>
  </div>
);

VariablePreview.propTypes = {
  variable: PropTypes.string,
  value: PropTypes.any,
  onDelete: PropTypes.func.isRequired,
};

VariablePreview.defaultProps = {
  value: null,
  variable: null,
};

export default VariablePreview;
