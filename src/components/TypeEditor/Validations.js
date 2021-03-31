import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { get, map } from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { NativeSelect } from '../Form/Fields';
import ValidatedField from '../Form/ValidatedField';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

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

const getValidationTypesForVariable = (variableType) => get(VALIDATION_TYPES, variableType, []);

const renderValidationOptions = ({ field, validationType }) => {
  switch (validationType) {
    case 'minLength':
    case 'maxLength':
    case 'minValue':
    case 'maxValue':
    case 'minSelected':
    case 'maxSelected':
      return (
        <Field
          name={`${field}.value`}
          component={Fields.Text}
          type="number"
          parse={(value) => parseInt(value, 10)}
        />
      );
    default:
      return null;
  }
};

renderValidationOptions.propTypes = {
  field: PropTypes.string.isRequired,
  validationType: PropTypes.string.isRequired,
};

const ItemDelete = (props) => (
  <div
    className="form-fields-multi-select__delete"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <Icon name="delete" />
  </div>
);

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

const mapStateToItemProps = (state, { fields, index }) => ({
  rowValues: fields.get(index),
  allValues: fields.getAll(),
});

const mapDispatchToItemProps = (dispatch) => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

const Item = compose(
  connect(mapStateToItemProps, mapDispatchToItemProps),
  withHandlers(({ fields, openDialog, index }) => ({
    handleDelete: () => {
      openDialog({
        type: 'Warning',
        title: 'Remove validation',
        message: 'Are you sure you want to remove this rule?',
        onConfirm: () => { fields.remove(index); },
        confirmLabel: 'Remove validation',
      });
    },
  })),
)(
  ({
    field, variableType, rowValues, allValues, handleDelete,
  }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-options">
        <div className="form-fields-multi-select__rule-option">
          <ValidatedField
            component={NativeSelect}
            name={`${field}.type`}
            validation={{ required: true }}
            placeholder="Select a type"
            options={getValidationTypesForVariable(variableType).map(
              (validation) => (
                {
                  value: validation,
                  label: validation,
                  disabled: map(allValues, 'type').includes(validation),
                }
              ),
            )}
          />
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
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
              key={field}
              index={index}
              field={field}
              fields={fields}
              variableType={variableType}
            />
          ))
        }
      </div>
    </div>

    { (fields.length < getValidationTypesForVariable(variableType).length)
      && <AddItem onClick={() => fields.push({})} />}
  </div>
);

Items.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
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
      { label
        && <h4>{label}</h4>}
      <FieldArray
        name={name}
        component={Items}
        variableType={variableType}
        // eslint-disable-next-line react/jsx-props-no-spreading
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
