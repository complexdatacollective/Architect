import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { keys, toPairs, omit } from 'lodash';
import { compose, withState, withHandlers } from 'recompose';
import { Field, formValueSelector, change } from 'redux-form';
import { Icon, Button } from '../../ui/components';
import Select from '../Form/Fields/Select';
import Number from '../../ui/components/Fields/Number';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';
import { isValidationWithValue, getValidationOptionsForVariableType } from './options';


/**
 * TODO:
 * - delete
 * - truthy vals
 */

/*
 handleDelete: ({ fields, openDialog, index }) =>
      () => {
        openDialog({
          type: 'Warning',
          title: 'Remove item',
          message: 'Are you sure you want to remove this item?',
          onConfirm: () => { fields.remove(index); },
          confirmLabel: 'Remove item',
        });
      },
    handleChange: ({ properties, field, resetField }) =>
      (index) => {
        // Reset any fields after this one in the property index
        properties.slice(index + 1).forEach(
          ({ fieldName: propertyFieldName }) =>
            resetField(`${field}.${propertyFieldName}`),
        );
      },
  }),
*/

const ItemDelete = props => (
  <div className="form-fields-multi-select__delete" {...props}>
    <Icon name="delete" />
  </div>
);

const AddItem = props => (
  <Button color="primary" icon="add" size="small" {...props}>
    Add new
  </Button>
);

const getOptionsWithUsedDisabled = (options, used) =>
  options.map((option) => {
    if (!used.includes(option.value)) { return option; }
    return { ...option, isDisabled: true };
  });

const Item = ({
  onDelete,
  onUpdate,
  options,
  itemKey,
  itemValue,
}) => (
  <div className="form-fields-multi-select__rule">
    <div className="form-fields-multi-select__rule-options">
      <div className="form-fields-multi-select__rule-option">
        <Select
          options={options}
          input={{ value: itemKey }}
          validation={{ required: true }}
          placeholder="&mdash; Select &mdash;"
          onChange={option => onUpdate({ [option.value]: itemValue }, itemKey)}
        />
      </div>
      <div className="form-fields-multi-select__rule-option">
        { isValidationWithValue(itemKey) &&
          <Number
            input={{
              value: itemValue,
              onChange: newValue => onUpdate({ [itemKey]: newValue }, itemKey),
            }}
          />
        }
      </div>
    </div>
    <div className="form-fields-multi-select__rule-control">
      <ItemDelete onClick={() => onDelete(itemKey)} />
    </div>
  </div>
);

const Items = ({ input, options, ...rest }) => {
  return (
    <div className="form-fields-multi-select">
      <div className="form-fields-multi-select__rules">
        {
          input.value.map(([key, value]) => {
            return (
              <Item
                key={key}
                itemKey={key}
                itemValue={value}
                options={options}
                {...rest}
              />
            );
          })
        }
      </div>
    </div>
  );
};

const format = (value = {}) => toPairs(value);

const mapStateToProps = (state, { form, name, variableType }) => {
  const validationOptions = getValidationOptionsForVariableType(variableType);

  return {
    validationOptions,
    value: formValueSelector(form)(state, name),
  };
};

const mapDispatchToProps = (dispatch, { form, name }) => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  update: value => dispatch(change(form, name, value)),
});

const withAddNew = withState('addNew', 'setAddNew', false);

const getUpdatedValue = (value, newPair, key = null) => {
  if (!key) { return { ...value, ...newPair }; }

  return {
    ...omit(value, key),
    ...newPair,
  };
};

const handlers = withHandlers({
  handleDelete: ({ openDialog, update, value }) =>
    (key) => {
      const newValue = getUpdatedValue(value, {}, key);

      openDialog({
        type: 'Warning',
        title: 'Remove validation',
        message: 'Are you sure you want to remove this rule?',
        onConfirm: () => { update(newValue); },
        confirmLabel: 'Remove item',
      });
    },
  handleChange: ({ update, value }) =>
    (newPair, key) => {
      const newValue = getUpdatedValue(value, newPair, key);
      update(newValue);
    },
  handleAddNew: ({ update, value, setAddNew }) =>
    (newPair) => {
      const newValue = getUpdatedValue(value, newPair);
      update(newValue);
      setAddNew(false);
    },
});

const Validations = ({
  name,
  properties,
  validationOptions,
  label,
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
      { label &&
        <div className="form-fields-multi-select__label">{label}</div>
      }
      <Field
        name={name}
        component={Items}
        properties={properties}
        format={format}
        options={availableOptions}
        onUpdate={handleChange}
        onDelete={handleDelete}
      />

      { addNew &&
        <Item
          onUpdate={handleAddNew}
          onDelete={() => setAddNew(false)}
          options={availableOptions}
        />
      }

      { !isFull &&
        <AddItem onClick={() => setAddNew(true)} />
      }
    </div>
  );
};

export { Validations };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAddNew,
  handlers,
)(Validations);
