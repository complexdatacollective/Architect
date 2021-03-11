import { connect } from 'react-redux';
import { change, getFormValues } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { get } from 'lodash';
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

const matchingPaths = (obj, paths, value) => paths.filter((path) => get(obj, path) === value);

const variableHandlers = withHandlers({
  onCreateOtherVariable: ({
    createVariable,
    entity,
    type,
    form,
    changeForm,
  }) => (name, field) => {
    const { variable } = createVariable(entity, type, { type: 'text', name });

    // If we supplied a field, update it with the result of the variable creation
    if (field) {
      changeForm(form, field, variable);
    }

    return variable;
  },
  onDeleteVariable: ({
    entity,
    type,
    deleteVariable,
    form,
    formValues,
    changeForm,
  }) => (variable, formPaths = []) => {
    // TODO: share this functionality with enhancers?
    const variableDeleted = deleteVariable(entity, type, variable);

    if (!variableDeleted) { return; }

    const formPathsArray = Array.isArray(formPaths)
      ? formPaths
      : [formPaths];

    matchingPaths(formValues, formPathsArray, variable)
      .forEach((path) => changeForm(form, path, null));
  },
});

const withVariableHandlers = compose(
  deleteVariableState,
  variableHandlers,
);

export default withVariableHandlers;
