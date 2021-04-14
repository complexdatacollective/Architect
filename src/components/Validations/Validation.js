import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Icon } from '@codaco/ui';
import Number from '@codaco/ui/lib/components/Fields/Number';
import NativeSelect from '../Form/Fields/NativeSelect';
import { isValidationWithNumberValue, isValidationWithListValue } from './options';

const Validation = ({
  onDelete,
  onUpdate,
  options,
  itemKey,
  itemValue,
  existingVariables,
}) => {
  const handleKeyChange = (option) => onUpdate(option, itemValue, itemKey);

  const handleValueChange = (newValue) => onUpdate(itemKey, newValue, itemKey);

  const keyInputProps = {
    value: itemKey,
    onChange: handleKeyChange,
  };

  const valueInputProps = {
    value: itemValue || '',
    onChange: handleValueChange,
  };

  const existingVariableOptions = map(existingVariables, (variableValue, variableKey) => (
    { label: variableValue.name, value: variableKey }));
  return (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-options">
        <div className="form-fields-multi-select__rule-option">
          <NativeSelect
            options={options}
            input={keyInputProps}
            validation={{ required: true }}
            placeholder="Select validation rule"
          />
        </div>
        { isValidationWithNumberValue(itemKey)
          && (
          <div className="form-fields-multi-select__rule-option">
            <Number input={valueInputProps} validation={{ required: true }} />
          </div>
          )}
        { isValidationWithListValue(itemKey)
          && (
          <div className="form-fields-multi-select__rule-option">
            <NativeSelect
              options={existingVariableOptions}
              input={valueInputProps}
              validation={{ required: true }}
              placeholder="Select comparison variable"
            />
          </div>
          )}
      </div>
      <div className="form-fields-multi-select__rule-control">
        <div className="form-fields-multi-select__delete" onClick={() => onDelete(itemKey)}>
          <Icon name="delete" />
        </div>
      </div>
    </div>
  );
};

Validation.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  itemKey: PropTypes.string,
  itemValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  existingVariables: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

Validation.defaultProps = {
  options: [],
  itemKey: null,
  itemValue: null,
};

export default Validation;
