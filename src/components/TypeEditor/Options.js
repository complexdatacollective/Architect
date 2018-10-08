import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { compose, defaultProps, withProps } from 'recompose';
import { toNumber } from 'lodash';
import { SortableElement, SortableHandle, SortableContainer } from 'react-sortable-hoc';
import { Field, FieldArray } from 'redux-form';
import { Icon } from '../../ui/components';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const isNumberLike = value =>
  parseInt(value, 10) == value; // eslint-disable-line

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

const mapDispatchToItemProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

const Item = compose(
  connect(null, mapDispatchToItemProps),
  withProps(
    ({ fields, openDialog, index }) => ({
      handleDelete: () => {
        openDialog({
          type: 'Confirm',
          title: 'Remove item',
          message: 'Are you sure you want to remove this item?',
          onConfirm: () => { fields.remove(index); },
          confirmLabel: 'Remove item',
        });
      },
    }),
  ),
  SortableElement,
)(
  ({ field, handleDelete }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-control">
        <ItemHandle />
      </div>
      <div className="form-fields-multi-select__rule-options">
        <div className="form-fields-multi-select__rule-option">
          <div className="form-fields-multi-select__rule-option-label">Label</div>
          <Field component="input" type="text" name={`${field}.label`} placeholder="label" />
        </div>
        <div className="form-fields-multi-select__rule-option">
          <div className="form-fields-multi-select__rule-option-label">Value</div>
          <Field component="input" type="text" name={`${field}.value`} parse={value => (isNumberLike(value) ? toNumber(value) : value)} placeholder="value" />
        </div>
      </div>
      <div className="form-fields-multi-select__rule-control">
        <ItemDelete onClick={handleDelete} />
      </div>
    </div>
  ),
);

Item.propTypes = {
  fields: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

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
              />
            ))
          }
        </div>
      </div>

      <AddItem onClick={() => fields.push({})} />
    </div>
  ),
);

Items.propTypes = {
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
  }).isRequired,
};

const Options = ({
  name,
  label,
  ...rest
}) => (
  <div className="form-fields-multi-select type-editor__subsection">
    { label &&
      <h4>{label}</h4>
    }
    <FieldArray
      name={name}
      component={Items}
      {...rest}
    />
  </div>
);

Options.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Options.defaultProps = {
  label: '',
};

export default Options;
