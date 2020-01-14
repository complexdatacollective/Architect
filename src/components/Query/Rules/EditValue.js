/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { withProps } from 'recompose';
import PropTypes from 'prop-types';
import DetachedField from '@components/DetachedField';
import { Text, Toggle, Number, RadioGroup } from '@codaco/ui/lib/components/Fields';

const INPUT_TYPES = {
  string: Text,
  number: Number,
  boolean: Toggle,
  categorical: RadioGroup,
  ordinal: RadioGroup,
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
  return value ? 'True' : 'False';
};

const EditValue = ({
  fieldComponent: FieldComponent,
  value,
  variableType,
  onChange,
  options,
  ...rest
}) => (
  <DetachedField
    component={FieldComponent}
    label={getLabel(variableType, value)}
    name="value"
    onChange={onChange}
    value={value}
    options={options}
    {...rest}
  />
);

EditValue.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  options: PropTypes.array,
  onChange: PropTypes.func,
  fieldComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

EditValue.defaultProps = {
  onChange: () => {},
  options: [],
};

export default withMappedFieldComponent(EditValue);
