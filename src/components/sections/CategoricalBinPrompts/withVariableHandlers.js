import { connect } from 'react-redux';
import { change, getFormValues } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

const mapStateToProps = (state, props) => ({
  formValues: getFormValues(props.form)(state),
});

const mapDispatchToProps = {
  deleteVariable: codebookActions.deleteVariable,
  createVariable: codebookActions.createVariable,
  changeForm: change,
};

const deleteVariableState = connect(mapStateToProps, mapDispatchToProps);

const variableHandlers = withHandlers({
  onCreateOtherVariable: ({
    createVariable,
    entity,
    type,
    form,
    changeForm,
  }) => async (name, field) => {
    const { variable } = await createVariable(entity, type, { type: 'text', name });

    // If we supplied a field, update it with the result of the variable creation
    if (field) {
      changeForm(form, field, variable);
    }

    return variable;
  },
});

const withVariableHandlers = compose(
  deleteVariableState,
  variableHandlers,
);

export default withVariableHandlers;
