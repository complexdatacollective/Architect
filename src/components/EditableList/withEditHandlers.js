import { connect } from 'react-redux';
import uuid from 'uuid';
import {
  compose,
  withHandlers,
} from 'recompose';
import { get } from 'lodash';
import {
  formValueSelector,
  change,
} from 'redux-form';

const mapStateToProps = (state, { form, fieldName, editField, template = {} }) => {
  const items = formValueSelector(form.name)(state, fieldName);
  const itemCount = items ? items.length : 0;

  const initialValues = get(
    { [fieldName]: items },
    editField,
    { ...template, id: uuid() },
  );


  return {
    itemCount,
    initialValues,
  };
};

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  upsert: (fieldId, value) => dispatch(change(name, fieldId, value)),
});

const handlers = withHandlers({
  handleEditField: ({ setEditField }) =>
    fieldId => setEditField(fieldId),
  handleResetEditField: ({ setEditField }) =>
    () => setEditField(),
  handleAddNew: ({
    setEditField,
    itemCount,
    fieldName,
  }) =>
    () => {
      const newItemFieldName = `${fieldName}[${itemCount}]`;
      setEditField(newItemFieldName);
    },
  handleUpdate: ({
    upsert,
    setEditField,
    editField,
  }) =>
    (value) => {
      upsert(editField, value);
      setImmediate(() => {
        setEditField();
      });
    },
});

const withEditHandlers = compose(
  connect(mapStateToProps, mapDispatchToProps),
  handlers,
);

export default withEditHandlers;
