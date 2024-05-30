import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { keys as getKeys, toPairs, isNull } from 'lodash';
import { Field } from 'redux-form';
import { Button } from '@codaco/ui';
import FieldError from '@components/Form/FieldError';
import Validation from './Validation';

const validate = (validations) => {
  const values = toPairs(validations);

  const check = values.reduce(
    (acc, [key, value]) => {
      if (!isNull(value)) { return acc; }
      return [...acc, key];
    },
    [],
  );

  if (check.length === 0) { return undefined; }

  return `Validations (${check.join(', ')}) must have values`;
};

const format = (value = {}) => toPairs(value);

const getOptionsWithUsedDisabled = (options, used) => options.map((option) => {
  if (!used.includes(option.value)) { return option; }
  return { ...option, disabled: true };
});

const AddItem = (props) => (
  <Button
    color="primary"
    icon="add"
    size="small"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    Add new
  </Button>
);

const ValidationsField = ({
  input,
  options,
  existingVariables,
  meta: { submitFailed, error },
  children,
  ...rest
}) => {
  const fieldClassNames = cx(
    'form-fields-multi-select__field',
    { 'form-fields-multi-select__field--has-error': submitFailed && error },
  );

  return (
    <div className={fieldClassNames}>
      <div className="form-fields-multi-select__rules">
        {input.value.map(([key, value]) => (
          <Validation
            key={key}
            itemKey={key}
            itemValue={value}
            options={options}
            existingVariables={existingVariables}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rest}
          />
        ))}
        {children}
      </div>
      <FieldError show={!!(submitFailed && error)} error={error} />
    </div>
  );
};

ValidationsField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  existingVariables: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  children: PropTypes.node,
};

ValidationsField.defaultProps = {
  options: [],
  children: null,
};

const Validations = ({
  name,
  validationOptions,
  existingVariables,
  value,
  addNew,
  setAddNew,
  handleChange,
  handleDelete,
  handleAddNew,
}) => {
  const usedOptions = getKeys(value);
  const availableOptions = getOptionsWithUsedDisabled(validationOptions, usedOptions);
  const isFull = usedOptions.length === availableOptions.length;

  return (
    <div className="form-fields-multi-select">
      <Field
        name={name}
        component={ValidationsField}
        format={format}
        options={availableOptions}
        existingVariables={existingVariables}
        onUpdate={handleChange}
        onDelete={handleDelete}
        validate={validate}
      >
        {addNew
          && (
            <Validation
              onUpdate={handleAddNew}
              onDelete={() => setAddNew(false)}
              options={availableOptions}
              existingVariables={existingVariables}
            />
          )}
      </Field>

      {!isFull
        && <AddItem onClick={() => setAddNew(true)} />}
    </div>
  );
};

Validations.propTypes = {
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  validationOptions: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object,
  addNew: PropTypes.bool.isRequired,
  setAddNew: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddNew: PropTypes.func.isRequired,
  existingVariables: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

Validations.defaultProps = {
  validationOptions: [],
  value: {},
  existingVariables: {},
};

export default Validations;
