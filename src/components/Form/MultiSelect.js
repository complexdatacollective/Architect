import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  compose,
  defaultProps,
  withProps,
  withHandlers,
} from 'recompose';
import { SortableElement, SortableHandle, SortableContainer } from 'react-sortable-hoc';
import { FieldArray, formValueSelector, change } from 'redux-form';
import { Icon, Button } from '@codaco/ui';
import NativeSelect from './Fields/NativeSelect';
import ValidatedField from './ValidatedField';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const ItemHandle = compose(
  SortableHandle,
)(
  () => (
    <div className="form-fields-multi-select__handle">
      <Icon name="move" />
    </div>
  ),
);

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

const mapStateToItemProps = (state, { field, fields: { name: fieldsName }, meta: { form } }) => ({
  rowValues: formValueSelector(form)(state, field),
  allValues: formValueSelector(form)(state, fieldsName),
  form,
});

const mapDispatchToItemProps = (dispatch, { meta: { form } }) => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  resetField: (fieldName) => dispatch(change(form, fieldName, null)),
});

const Item = compose(
  connect(mapStateToItemProps, mapDispatchToItemProps),
  withHandlers({
    handleDelete: ({ fields, openDialog, index }) => () => {
      openDialog({
        type: 'Warning',
        title: 'Remove item',
        message: 'Are you sure you want to remove this item?',
        onConfirm: () => { fields.remove(index); },
        confirmLabel: 'Remove item',
      });
    },
    handleChange: ({ properties, field, resetField }) => (index) => {
      // Reset any fields after this one in the property index
      properties.slice(index + 1).forEach(
        ({ fieldName: propertyFieldName }) => resetField(`${field}.${propertyFieldName}`),
      );
    },
  }),
  SortableElement,
)(
  ({
    field,
    properties,
    options,
    rowValues,
    allValues,
    handleDelete,
    handleChange,
  }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-control">
        <ItemHandle />
      </div>

      <div className="form-fields-multi-select__rule-options">
        {properties.map(
          ({ fieldName, ...rest }, index) => (
            <div className="form-fields-multi-select__rule-option" key={fieldName}>
              <ValidatedField
                component={NativeSelect}
                name={`${field}.${fieldName}`}
                options={options(fieldName, rowValues, allValues)}
                validation={{ required: true }}
                onChange={() => handleChange(index)}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
              />
            </div>
          ),
        )}
      </div>
      <div className="form-fields-multi-select__rule-control">
        <ItemDelete onClick={handleDelete} />
      </div>
    </div>
  ),
);

const Items = compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
    maxItems: null,
  }),
  withProps(
    ({ fields }) => ({
      onSortEnd: ({ oldIndex, newIndex }) => fields.move(oldIndex, newIndex),
    }),
  ),
  SortableContainer,
)(
  ({ fields, maxItems, ...rest }) => {
    const hasSpace = maxItems === null || fields.length < maxItems;
    const showAdd = hasSpace;

    return (
      <>
        <div className="form-fields-multi-select">
          <div className="form-fields-multi-select__rules">
            {
              fields.map((field, index) => (
                <Item
                  index={index}
                  key={field}
                  field={field}
                  fields={fields}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...rest}
                />
              ))
            }
          </div>
        </div>

        { showAdd
          && <AddItem onClick={() => fields.push({ })} />}

        { !showAdd && fields.length === 0
          && <p><em>No properties available.</em></p>}
      </>
    );
  },
);

const MultiSelect = ({
  name,
  properties,
  options,
  label,
  ...rest
}) => (
  <div className="form-fields-multi-select">
    { label
      && <div className="form-fields-multi-select__label">{label}</div>}
    <FieldArray
      name={name}
      component={Items}
      properties={properties}
      options={options}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  </div>
);

MultiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  properties: PropTypes.array.isRequired,
  options: PropTypes.func.isRequired,
  label: PropTypes.string,
  maxItems: PropTypes.number,
};

MultiSelect.defaultProps = {
  label: '',
  maxItems: null,
};

export default MultiSelect;
