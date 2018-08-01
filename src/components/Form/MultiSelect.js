import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, defaultProps, withProps, withHandlers } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer } from 'react-sortable-hoc';
import { FieldArray, formValueSelector } from 'redux-form';
import { Icon } from '../../ui/components';
import Select from './Fields/Select';
import ValidatedField from '../Form/ValidatedField';

const ItemHandle = compose(
  SortableHandle,
)(
  () => (
    <div className="form-fields-multi-select__handle">
      <Icon name="move" />
    </div>
  ),
);

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
    (state, { field, fields: { name: fieldsName }, meta: { form } }) => ({
      rowValues: formValueSelector(form)(state, field),
      allValues: formValueSelector(form)(state, fieldsName),
    }),
  ),
  withHandlers(({ fields, sortIndex: index }) => ({
    handleDelete: () => {
      if (confirm('Are you sure you want to remove this item?')) {
        fields.remove(index);
      }
    },
  })),
  SortableElement,
)(
  ({
    field,
    properties,
    options,
    rowValues,
    allValues,
    handleDelete,
  }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-control">
        <ItemHandle />
      </div>

      <div className="form-fields-multi-select__rule-options">
        {properties.map(
          property => (
            <div className="form-fields-multi-select__rule-option" key={property}>
              <ValidatedField
                component={Select}
                name={`${field}.${property}`}
                options={options(property, rowValues, allValues)}
                validation={{ required: true }}
              >
                <option value="" disabled>&mdash; Select {property} &mdash;</option>
              </ValidatedField>
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
  }),
  withProps(
    ({ fields }) => ({
      onSortEnd: ({ oldIndex, newIndex }) => fields.move(oldIndex, newIndex),
    }),
  ),
  SortableContainer,
)(
  ({ fields, ...rest }) => (
    <React.Fragment>
      <div className="form-fields-multi-select">
        <div className="form-fields-multi-select__rules">
          {
            fields.map((field, index) => (
              <Item
                index={index}
                key={index}
                sortIndex={index}
                field={field}
                fields={fields}
                {...rest}
              />
            ))
          }
        </div>
      </div>

      { true &&
        <AddItem onClick={() => fields.push({ })} />
      }
    </React.Fragment>
  ),
);

const MultiSelect = ({
  name,
  properties,
  options,
  label,
  ...rest
}) => (
  <div className="form-fields-multi-select">
    { label &&
      <div className="form-fields-multi-select__label">{label}</div>
    }
    <FieldArray
      name={name}
      component={Items}
      properties={properties}
      options={options}
      {...rest}
    />
  </div>
);

MultiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  properties: PropTypes.array.isRequired,
  options: PropTypes.func.isRequired,
  label: PropTypes.string,
};

MultiSelect.defaultProps = {
  label: '',
};

export default MultiSelect;
