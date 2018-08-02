import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { get, map } from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { Icon } from '../../ui/components';
import { Select } from '../Form/Fields';
import ValidatedField from '../Form/ValidatedField';

const VALIDATION_TYPES = {
  text: [
    'required',
    'minLength',
    'maxLength',
  ],
  number: [
    'required',
    'minValue',
    'maxValue',
  ],
  datetime: [
    'required',
  ],
  boolean: [
    'required',
  ],
  ordinal: [
    'required',
  ],
  categorical: [
    'required',
    'minSelected',
    'maxSelected',
  ],
};

const getValidationTypesForVariable = variableType =>
  get(VALIDATION_TYPES, variableType, []);

const renderValidationOptions = ({ field, validationType }) => {
  switch (validationType) {
    case 'minLength':
    case 'maxLength':
    case 'minValue':
    case 'maxValue':
      return (
        <Field
          name={`${field}.value`}
          component="input"
          type="number"
          parse={value => parseInt(value, 10)}
        />
      );
    default:
      return null;
  }
};

const ItemDelete = props => (
  <div className="form-fields-multi-select__delete" {...props}>
    <Icon name="delete" />
  </div>
);

const AddItem = props => (
  <div className="form-fields-multi-select__add" {...props}>
    <Icon name="add" /> Add new
  </div>
);

const Item = compose(
  connect(
    (state, { fields, index }) => ({
      rowValues: fields.get(index),
      allValues: fields.getAll(),
    }),
  ),
  withHandlers(({ fields, index }) => ({
    handleDelete: () => {
      // eslint-disable-next-line no-alert
      if (confirm('Are you sure you want to remove this item?')) {
        fields.remove(index);
      }
    },
  })),
)(
  ({ field, variableType, rowValues, allValues, handleDelete }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-options">
        <div className="form-fields-multi-select__rule-option">
          <ValidatedField
            component={Select}
            name={`${field}.type`}
            validation={{ required: true }}
          >
            <option value="" disabled>&mdash; Select type &mdash;</option>
            { getValidationTypesForVariable(variableType).map(
              (validation, key) => (
                <option
                  key={key}
                  value={validation}
                  disabled={map(allValues, 'type').includes(validation)}
                >{validation}</option>
              ),
            ) }
          </ValidatedField>
        </div>
        <div className="form-fields-multi-select__rule-option">
          {
            renderValidationOptions({
              field,
              validationType: get(rowValues, 'type'),
            })
          }
        </div>
      </div>
      <div className="form-fields-multi-select__rule-control">
        <ItemDelete onClick={handleDelete} />
      </div>
    </div>
  ),
);

const Items = ({ fields, variableType, ...rest }) => (
  <div className="form-field-container">
    <div className="form-fields-multi-select">
      <div className="form-fields-multi-select__rules">
        {
          fields.map((field, index) => (
            <Item
              {...rest}
              key={index}
              index={index}
              field={field}
              fields={fields}
              variableType={variableType}
            />
          ))
        }
      </div>
    </div>

    { (fields.length < getValidationTypesForVariable(variableType).length) &&
      <AddItem onClick={() => fields.push({})} />
    }
  </div>
);

Items.propTypes = {
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
  }).isRequired,
  variableType: PropTypes.string.isRequired,
};

const Validations = ({
  name,
  label,
  variableType,
  ...rest
}) => {
  if (getValidationTypesForVariable(variableType).length === 0) { return null; }

  return (
    <div className="form-fields-multi-select type-editor__subsection">
      { label &&
        <h4>{label}</h4>
      }
      <FieldArray
        name={name}
        component={Items}
        variableType={variableType}
        {...rest}
      />
    </div>
  );
};

Validations.propTypes = {
  name: PropTypes.string.isRequired,
  variableType: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Validations.defaultProps = {
  label: '',
};

export default Validations;
