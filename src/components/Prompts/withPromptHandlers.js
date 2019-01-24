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
  const prompts = formValueSelector(form.name)(state, fieldName);
  const promptCount = prompts ? prompts.length : 0;
  const initialValues = get(
    { prompts },
    editField,
    { ...template, id: uuid() },
  );


  return {
    promptCount,
    initialValues,
  };
};

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  upsertPrompt: (fieldId, value) => dispatch(change(name, fieldId, value)),
});

const promptHandlers = withHandlers({
  handleEditField: ({ setEditField }) =>
    fieldId => setEditField(fieldId),
  handleResetEditField: ({ setEditField }) =>
    () => setEditField(),
  handleAddNewPrompt: ({
    setEditField,
    promptCount,
    fieldName,
  }) =>
    () => {
      const newPromptName = `${fieldName}[${promptCount}]`;
      setEditField(newPromptName);
    },
  handleUpdatePrompt: ({
    upsertPrompt,
    setEditField,
    editField,
  }) =>
    (value) => {
      upsertPrompt(editField, value);
      setImmediate(() => {
        setEditField();
      });
    },
});

const withPromptHandlers = compose(
  connect(mapStateToProps, mapDispatchToProps),
  promptHandlers,
);

export default withPromptHandlers;
