/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { withProps } from 'recompose';
import PropTypes from 'prop-types';
import DetachedField from '../DetachedField';
import { Text, Toggle, Number } from '../../ui/components/Fields';

const INPUT_TYPES = {
  string: Text,
  number: Number,
  boolean: Toggle,
};

/**
 * Convert variable type to input type
 */
const withMappedFieldComponent = withProps(
  ({ variableType }) => ({
    fieldComponent: variableType &&
      INPUT_TYPES[variableType] ? INPUT_TYPES[variableType] : Text,
  }),
);

const getLabel = (type, value) => {
  if (type !== 'boolean') { return 'Value'; }
  return value ? 'TRUE' : 'FALSE';
};

const EditValue = ({
  fieldComponent: FieldComponent,
  value,
  variableType,
  onChange,
  ...rest
}) => (
  <DetachedField
    component={FieldComponent}
    label={getLabel(variableType, value)}
    name="value"
    onChange={onChange}
    value={value}
    {...rest}
  />
);

EditValue.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func,
  fieldComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

EditValue.defaultProps = {
  onChange: () => {},
};

export default withMappedFieldComponent(EditValue);
