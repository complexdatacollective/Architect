import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean, isArray } from 'lodash';
import { Icon } from '../../../../../ui/components';

const formatValue = (value) => {
  if (isBoolean(value)) { return value ? <em>TRUE</em> : <em>FALSE</em>; }
  if (isArray(value)) { return value.join(', '); }
  return value;
};

const VariablePreview = ({ value, label, error, variable, onDelete }) => (
  <div className="attributes-table-preview">
    <div className="attributes-table-preview__name">{label}</div>
    { error &&
      <div className="attributes-table-preview__error">{error}</div>
    }
    { !error &&
      <div className="attributes-table-preview__value">{ formatValue(value, error)}</div>
    }
    <div className="attributes-table-preview__delete" onClick={() => onDelete(variable)}>
      <Icon name="delete" />
    </div>
  </div>
);

VariablePreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  error: PropTypes.string,
  variable: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

VariablePreview.defaultProps = {
  error: undefined,
  label: null,
  variable: null,
};

export { VariablePreview };

export default VariablePreview;
