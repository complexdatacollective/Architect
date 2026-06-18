import DetachedField from '@components/DetachedField';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';

import {
  Number,
  // CheckboxGroup,
  RadioGroup,
  Text,
  Toggle,
} from '@codaco/ui/lib/components/Fields';

// Todo: reinstate CheckboxGroup support when we switch to schema 8
const INPUT_TYPES = {
  string: Text,
  number: Number,
  boolean: Toggle,
  categorical: RadioGroup,
  ordinal: RadioGroup,
  // categorical: CheckboxGroup,
  // ordinal: CheckboxGroup,
};

/**
 * Convert variable type to input type
 */
const withMappedFieldComponent = withProps(({ variableType }) => ({
  fieldComponent:
    variableType && INPUT_TYPES[variableType]
      ? INPUT_TYPES[variableType]
      : Text,
}));

const getLabel = (type, value) => {
  if (type !== 'boolean') {
    return null;
  }
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
    // PropTypes.array,
  ]).isRequired,
  options: PropTypes.array,
  onChange: PropTypes.func,
  fieldComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
    .isRequired,
  variableType: PropTypes.string.isRequired,
};

EditValue.defaultProps = {
  onChange: () => {},
  options: [],
};

export default withMappedFieldComponent(EditValue);
