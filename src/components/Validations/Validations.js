import React from 'react';
import PropTypes from 'prop-types';
import { keys, toPairs } from 'lodash';
import { Field } from 'redux-form';
import { Button } from '../../ui/components';
import Validation from './Validation';

const format = (value = {}) => toPairs(value);

const getOptionsWithUsedDisabled = (options, used) =>
  options.map((option) => {
    if (!used.includes(option.value)) { return option; }
    return { ...option, isDisabled: true };
  });

const AddItem = props => (
  <Button color="primary" icon="add" size="small" {...props}>
    Add new
  </Button>
);

const ValidationsField = ({ input, options, ...rest }) =>
  input.value.map(([key, value]) => (
    <Validation
      key={key}
      itemKey={key}
      itemValue={value}
      options={options}
      {...rest}
    />
  ));

ValidationsField.propTypes = {
  input: PropTypes.object.isRequired,
  options: PropTypes.array,
};

ValidationsField.defaultProps = {
  options: [],
};

const Validations = ({
  name,
  validationOptions,
  value,
  addNew,
  setAddNew,
  handleChange,
  handleDelete,
  handleAddNew,
}) => {
  const usedOptions = keys(value);
  const availableOptions = getOptionsWithUsedDisabled(validationOptions, usedOptions);
  const isFull = usedOptions.length === availableOptions.length;

  return (
    <div className="form-fields-multi-select">
      <div className="form-fields-multi-select__label">Validations</div>
      <div className="form-fields-multi-select__rules">
        <Field
          name={name}
          component={ValidationsField}
          format={format}
          options={availableOptions}
          onUpdate={handleChange}
          onDelete={handleDelete}
        />

        { addNew &&
          <Validation
            onUpdate={handleAddNew}
            onDelete={() => setAddNew(false)}
            options={availableOptions}
          />
        }
      </div>

      { !isFull &&
        <AddItem onClick={() => setAddNew(true)} />
      }
    </div>
  );
};

Validations.propTypes = {
  name: PropTypes.string.isRequired,
  validationOptions: PropTypes.array,
  value: PropTypes.object,
  addNew: PropTypes.func.isRequired,
  setAddNew: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddNew: PropTypes.func.isRequired,
};

Validations.defaultProps = {
  validationOptions: [],
  value: {},
};

export default Validations;
