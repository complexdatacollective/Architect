import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { compose, defaultProps, withHandlers } from 'recompose';
import { toNumber } from 'lodash';
import { SortableElement, SortableHandle, SortableContainer } from 'react-sortable-hoc';
import { FieldArray } from 'redux-form';
import { Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import FieldError from './Form/FieldError';
import ValidatedField from './Form/ValidatedField';
import { actionCreators as dialogsActions } from '../ducks/modules/dialogs';

const isNumberLike = (value) =>
  parseInt(value, 10) == value; // eslint-disable-line

const minTwoOptions = (value) => (
  !value || value.length < 2
    ? 'Requires a minimum of two options. If you need fewer options, consider using a boolean variable.'
    : undefined
);

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
  <div className="form-fields-multi-select__delete" {...props}>
    <Icon name="delete" />
  </div>
);

const AddItem = (props) => (
  <Button color="primary" icon="add" size="small" {...props}>
    Add new
  </Button>
);

const mapDispatchToItemProps = (dispatch) => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export const Item = compose(
  connect(null, mapDispatchToItemProps),
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
  }),
  SortableElement,
)(
  ({
    field,
    handleDelete,
  }) => (
    <div className="form-fields-multi-select__rule">
      <div className="form-fields-multi-select__rule-control">
        <ItemHandle />
      </div>
      <div className="form-fields-multi-select__rule-options">
        <div className="form-fields-multi-select__rule-option">
          <div className="form-fields-multi-select__rule-option-label">Label</div>
          <ValidatedField
            component={Fields.Text}
            type="text"
            name={`${field}.label`}
            placeholder="label"
            validation={{ required: true, uniqueArrayAttribute: true }}
          />
        </div>
        <div className="form-fields-multi-select__rule-option">
          <div className="form-fields-multi-select__rule-option-label">Value</div>
          <ValidatedField
            component={Fields.Text}
            type="text"
            name={`${field}.value`}
            parse={(value) => (isNumberLike(value) ? toNumber(value) : value)}
            placeholder="value"
            // option values must also respect allowedVariableName (NMTOKEN) rules
            validation={{ required: true, uniqueArrayAttribute: true, allowedVariableName: 'option value' }}
          />
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

export const Items = compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
  }),
  withHandlers({
    onSortEnd: ({ fields }) => ({ oldIndex, newIndex }) => fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(
  ({
    fields,
    meta: { error, submitFailed },
    ...rest
  }) => {
    const classes = cx(
      'form-fields-multi-select__field',
      { 'form-fields-multi-select__field--has-error': submitFailed && error },
    );

    return (
      <div className="form-field-container">
        <div className="form-fields-multi-select">
          <div className={classes}>
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

            <FieldError
              show={submitFailed && error}
              error={error}
            />
          </div>
          <AddItem onClick={() => fields.push({})} />
        </div>
      </div>
    );
  },
);

Items.propTypes = {
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
  }).isRequired,
};

const Options = ({
  name,
  ...rest
}) => (
  <div className="form-fields-multi-select type-editor__subsection">
    <FieldArray
      name={name}
      component={Items}
      validate={minTwoOptions}
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
