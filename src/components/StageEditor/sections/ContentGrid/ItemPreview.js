import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean, isArray } from 'lodash';
import { Icon } from '../../../../ui/components';

const formatValue = (value) => {
  if (isBoolean(value)) { return value ? <em>TRUE</em> : <em>FALSE</em>; }
  if (isArray(value)) { return value.join(', '); }
  return value;
};

const VariablePreview = ({ variable, value, onDelete }) => (
  <div className="attributes-table-preview">
    <div className="attributes-table-preview__name">{variable}</div>
    <div className="attributes-table-preview__value">{formatValue(value)}</div>
    <div className="attributes-table-preview__delete" onClick={onDelete}>
      <Icon name="delete" />
    </div>
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
