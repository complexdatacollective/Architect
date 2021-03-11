import { connect } from 'react-redux';
import uuid from 'uuid';
import {
  compose,
  defaultProps,
  withHandlers,
} from 'recompose';
import {
  formValueSelector,
  change,
} from 'redux-form';
import { getRemainingSpace } from './helpers';

const mapStateToProps = (
  state, {
    capacity,
    form,
    fieldName,
    itemSelector,
    editField,
    template,
  },
) => {
  const items = formValueSelector(form)(state, fieldName) || [];
  const itemCount = items ? items.length : 0;
  const item = itemSelector(state, { form, editField });
  const initialValues = item || { ...template(), id: uuid() };
  const hasSpace = getRemainingSpace(items, capacity) > 0;

  return {
    itemCount,
    hasSpace,
    items,
    initialValues,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  upsert: (fieldId, value) => dispatch(change(form, fieldId, value)),
});

const handlers = withHandlers({
  handleEditField: ({ setEditField }) => (fieldId) => setEditField(fieldId),
  handleResetEditField: ({ setEditField }) => () => setEditField(),
  handleAddNew: ({
    setEditField,
    itemCount,
    fieldName,
  }) => () => {
    const newItemFieldName = `${fieldName}[${itemCount}]`;
    setEditField(newItemFieldName);
  },
  handleUpdate: ({
    upsert,
    setEditField,
    editField,
    normalize,
    onChange,
  }) => (value) => {
    upsert(editField, normalize(value));
    if (onChange) { onChange(value); }
    setImmediate(() => {
      setEditField();
    });
  },
});

const withEditHandlers = compose(
  defaultProps({
    normalize: (value) => value,
    template: () => ({ size: 'SMALL' }),
    itemSelector: (state, { form, editField }) => formValueSelector(form)(state, editField),
  }),
  connect(mapStateToProps, mapDispatchToProps),
  handlers,
);

export default withEditHandlers;
