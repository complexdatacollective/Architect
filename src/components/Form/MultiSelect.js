import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { compose, defaultProps, withProps, withHandlers } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer } from 'react-sortable-hoc';
import { FieldArray, formValueSelector } from 'redux-form';
import { Icon, Button } from '../../ui/components';
import Select from './Fields/Select';
import ValidatedField from '../Form/ValidatedField';
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

const mapStateToItemProps = (state, { field, fields: { name: fieldsName }, meta: { form } }) => ({
  rowValues: formValueSelector(form)(state, field),
  allValues: formValueSelector(form)(state, fieldsName),
});

const mapDispatchToItemProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

const resetLinkedSelectValue = (event) => {
  console.log(event);
};

const Item = compose(
  connect(mapStateToItemProps, mapDispatchToItemProps),
  withHandlers({
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
  }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-control">
        <ItemHandle />
      </div>

      <div className="form-fields-multi-select__rule-options">
        {properties.map(
          property => (
            <div className="form-fields-multi-select__rule-option" key={property.fieldName}>
              <ValidatedField
                component={Select}
                selectOptionComponent={property.selectOptionComponent}
                name={`${field}.${property.fieldName}`}
                options={options(property.fieldName, rowValues, allValues)}
                validation={{ required: true }}
                placeholder="&mdash; Select &mdash;"
                onChange={e => resetLinkedSelectValue(e)}
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
