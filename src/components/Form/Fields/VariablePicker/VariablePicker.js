import React, { useState } from 'react';
import { Button, Modal } from '@codaco/ui';
import VariablePill from './VariablePill';
import VariableSpotlight from './VariableSpotlight';

const VariablePicker = (props) => {
  const [showPicker, setShowPicker] = useState(false);
  console.log('variable picker props', props);
  const {
    options,
    label = 'Variable',
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

  const handleSelectVariable = (variable) => {
    onChange(variable);
    setShowPicker(false);
  };

  const handleCreateOption = async (variable) => {
    await onCreateOption(variable);
    setShowPicker(false);
  };

  const hideModal = () => setShowPicker(false);

  return (
    <>
      <div className="form-fields-variable-picker">
        <fieldset>
          <legend>{label}</legend>
          {value && (
            <VariablePill uuid={value} key={value} editable />
          )}
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
      <Modal show={showPicker} onBlur={hideModal}>
        <div
          style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <VariableSpotlight
            onSelect={handleSelectVariable}
            options={options}
            onCreateOption={handleCreateOption}
          />
        </div>
      </Modal>
    </>
  );
};

export default VariablePicker;
