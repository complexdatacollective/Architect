import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@codaco/ui';
import PropTypes from 'prop-types';
import { has, get } from 'lodash';
import EditableVariablePill, { SimpleVariablePill } from './VariablePill';
import VariableSpotlight from './VariableSpotlight';
import SpotlightModal from './SpotlightModal';

const VariablePicker = (props) => {
  const [showPicker, setShowPicker] = useState(false);

  const {
    options,
    entity,
    type,
    label = 'Create or Select a Variable',
    onCreateOption,
    disallowCreation,
    meta: {
      error,
      invalid,
      touched,
    },
    input: {
      value,
      onChange,
    },
  } = props;

  const handleSelectVariable = (variable) => {
    onChange(variable);
    setShowPicker(false);
  };

  const handleCreateOption = (variable) => {
    onChange(null);
    setShowPicker(false);
    onCreateOption(variable);
  };

  const hideModal = () => setShowPicker(false);

  // New variables have no 'type' property
  const variablePillComponent = () => {
    const found = options.find(({
      label: variableLabel,
      value: variableValue,
    }) => value === variableValue || value === variableLabel);

    if (has(found, 'type')) {
      return (
        <EditableVariablePill uuid={found.value} />
      );
    }

    const selectedLabel = get(found, 'label', null);
    const selectedValue = get(found, 'value', null);

    const finalLabel = selectedLabel || selectedValue;

    return (
      <SimpleVariablePill label={finalLabel} />
    );
  };

  return (
    <>
      <div className="form-fields-variable-picker">
        <fieldset>
          { label && (<legend>{label}</legend>)}
          { value && (
          <AnimatePresence exitBeforeEnter initial={false}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={value}
            >
              {variablePillComponent()}
            </motion.div>
          </AnimatePresence>
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
      <SpotlightModal show={showPicker} onBlur={hideModal}>
        <VariableSpotlight
          entity={entity}
          type={type}
          onSelect={handleSelectVariable}
          onCancel={hideModal}
          options={options}
          onCreateOption={handleCreateOption}
          disallowCreation={disallowCreation}
        />
      </SpotlightModal>
    </>
  );
};

VariablePicker.propTypes = {
  disallowCreation: PropTypes.bool,
  entity: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
  })),
  meta: PropTypes.shape({
    error: PropTypes.string,
    invalid: PropTypes.bool,
    touched: PropTypes.bool,
  }),
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }),
  onCreateOption: PropTypes.func,
};

VariablePicker.defaultProps = {
  disallowCreation: false,
  entity: null,
  type: null,
  label: 'Create or Select a Variable',
  options: [],
  meta: {
    error: null,
    invalid: false,
    touched: false,
  },
  input: {
    value: null,
    onChange: () => {},
  },
  onCreateOption: () => {},
};

export default VariablePicker;
