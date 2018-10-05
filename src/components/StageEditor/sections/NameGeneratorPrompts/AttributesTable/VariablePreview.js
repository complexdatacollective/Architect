import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean, isArray } from 'lodash';
import { Icon } from '../../../../../ui/components';

const formatValue = (value) => {
  if (isBoolean(value)) { return value ? <em>TRUE</em> : <em>FALSE</em>; }
  if (isArray(value)) { return value.join(', '); }
  return value;
};

const VariablePreview = ({ input: { value }, label, variable, onDelete }) => (
  <div className="attributes-table-preview">
    <div className="attributes-table-preview__name">{label}</div>
    <div className="attributes-table-preview__value">{formatValue(value)}</div>
    <div className="attributes-table-preview__delete" onClick={() => onDelete(variable)}>
      <Icon name="delete" />
    </div>
  </div>
);

VariablePreview.propTypes = {
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.any.isRequired,
  }).isRequired,
  variable: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

VariablePreview.defaultProps = {
  label: null,
  variable: null,
};

export { VariablePreview };

export default VariablePreview;
