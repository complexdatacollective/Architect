import { connect } from 'react-redux';
import { change, getFormValues } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { get } from 'lodash';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

const mapStateToProps = (state, props) => ({
  formValues: getFormValues(props.form)(state),
});

const mapDispatchToProps = {
  changeForm: change,
  deleteVariable: codebookActions.deleteVariable,
  createVariable: codebookActions.createVariable,
};

const deleteVariableState = connect(mapStateToProps, mapDispatchToProps);

const matchingPaths = (obj, paths, value) =>
  paths.filter(path => get(obj, path) === value);

const variableHandlers = withHandlers({
  handleCreateOtherVariable: ({
    createVariable,
    entity,
    type,
  }) =>
    (name) => {
      const { variable } = createVariable(entity, type, { type: 'text', name });
      return variable;
    },
  handleDeleteVariable: ({
    entity,
    type,
    deleteVariable,
    changeForm,
    form,
    formValues,
  }) =>
    (variable, formPaths = []) => {
      const variableDeleted = deleteVariable(entity, type, variable);

      if (!variableDeleted) { return; }

      const formPathsArray = Array.isArray(formPaths) ?
        formPaths :
        [formPaths];

      matchingPaths(formValues, formPathsArray, variable)
        .forEach(path => changeForm(form, path, null));
    },
});

const withVariableHandlers = compose(
  deleteVariableState,
  variableHandlers,
);

export default withVariableHandlers;
