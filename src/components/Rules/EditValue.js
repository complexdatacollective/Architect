/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { withProps, compose } from 'recompose';
import PropTypes from 'prop-types';
import DetachedField from '../DetachedField';
import { Text, Checkbox, Number } from '../../ui/components/Fields';

const INPUT_TYPES = {
  string: Text,
  number: Number,
  boolean: Checkbox,
};

/**
 * Convert variable type to input type
 */
const withMappedFieldComponent = compose(
  withProps(
    ({ variableType }) => ({
      fieldComponent: variableType &&
        INPUT_TYPES[variableType] ? INPUT_TYPES[variableType] : Text,
    }),
  ),
);

const EditValue = ({
  fieldComponent: FieldComponent,
  value,
  onChange,
  ...rest
}) => (
  <DetachedField
    component={FieldComponent}
    label="Value"
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
  ]),
  onChange: PropTypes.func,
  fieldComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

EditValue.defaultProps = {
  onChange: () => {},
  value: '',
};

export default withMappedFieldComponent(EditValue);
