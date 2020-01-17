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
};

const deleteVariableState = connect(mapStateToProps, mapDispatchToProps);

const matchingPaths = (obj, paths, value) =>
  paths.filter(path => get(obj, path) === value);

const deleteHandler = withHandlers({
  deleteVariable: ({
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

const withDeleteVariableHandler = compose(
  deleteVariableState,
  deleteHandler,
);

export default withDeleteVariableHandler;
