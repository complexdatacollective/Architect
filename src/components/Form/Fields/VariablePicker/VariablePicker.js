import React, { useState } from 'react';
import { Button } from '@codaco/ui';
import { useDispatch } from 'react-redux';
import { untouch } from 'redux-form';
import { has, get } from 'lodash';
import EditableVariablePill, { SimpleVariablePill } from './VariablePill';
import VariableSpotlight from './VariableSpotlight';
import SpotlightModal from './SpotlightModal';

const VariablePicker = (props) => {
  const [showPicker, setShowPicker] = useState(false);
  console.log('variable picker props', props);
  const {
    options,
    entity,
    type,
    label = 'Create or Select a Variable',
    // To create a new option, one or the other of the following:
    onCreateOption,
    meta: {
      error,
      invalid,
      touched,
    },
    input: {
      value,
      onChange
    }
  } = props;

  const dispatch = useDispatch();

  const handleSelectVariable = (variable) => {
    onChange(variable);
    setShowPicker(false);
  };

  const handleCreateOption = async (variable) => {
    onChange(null);

    // // Setting input to null above will 'touch' the select, triggering validation
    // // which we don't want yet. We 'un-touch' the input to resolve this.
    // dispatch(untouch(form, input.name));

    await onCreateOption(variable);
    setShowPicker(false);
  };

  const hideModal = () => setShowPicker(false);

  // New variables have no 'type' property
  const variablePillComponent = () => {
    const found = options.find(({
      label: variableLabel,
      value: variableValue,
    }) => value === variableValue || value === variableLabel);

    console.log('found', found);

    if (has(found, 'type')) {
      return (
        <EditableVariablePill uuid={found.value} />
      );
    }

    const selectedLabel = get(found, 'label', null);
    const selectedValue = get(found, 'value', null);
    const selectedType = get(found, 'type', null);

    const finalLabel = selectedLabel || selectedValue;

    return (
      <SimpleVariablePill label={finalLabel} type={selectedType} />
    );
  };

  return (
    <>
      <div className="form-fields-variable-picker">
        <fieldset>
          <legend>{label}</legend>
          {value && variablePillComponent()}
          <Button
            icon="add"
            onClick={() => setShowPicker(true)}
            size="small"
          >
            { value ? 'Change Variable' : 'Select Variable'}
          </Button>
          {invalid && touched && (
          <p className="form-fields-variable-picker__error">
            {error}
          </p>
          ) }
        </fieldset>
      </div>
      <SpotlightModal show={showPicker} onBlur={hideModal}>
        <VariableSpotlight
          entity={entity}
          type={type}
          onSelect={handleSelectVariable}
          onCancel={hideModal}
          options={options}
          onCreateOption={handleCreateOption}
        />
      </SpotlightModal>
    </>
  );
};

export default VariablePicker;
