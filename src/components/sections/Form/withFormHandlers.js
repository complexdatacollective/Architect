import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change, SubmissionError } from 'redux-form';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { getTypeForComponent } from '@components/Form/inputOptions';
import { getCodebookProperties } from './helpers';

const formHandlers = withHandlers({
  handleChangeFields: ({
    updateVariable,
    createVariable,
    type,
    entity,
    changeForm,
    form,
  }) =>
    (values) => {
      const { variable, component, _createNewVariable, ...rest } = values;
      const variableType = getTypeForComponent(component);
      // prune properties that are not part of the codebook:
      const codebookProperties = getCodebookProperties(rest);
      const configuration = {
        type: variableType,
        component,
        ...codebookProperties,
      };

      // Register a change in the stage editor
      // `form` here refers to the `section/` parent form, not the fields form
      changeForm(form, '_modified', new Date().getTime());

      if (!_createNewVariable) {
        updateVariable(entity, type, variable, configuration, true);

        return {
          variable,
          ...rest,
        };
      }

      try {
        const { variable: newVariable } = createVariable(
          entity,
          type,
          {
            ...configuration,
            name: _createNewVariable,
          },
        );

        return {
          variable: newVariable,
          ...rest,
        };
      } catch (e) {
        throw new SubmissionError({ variable: e.toString() });
      }
    },
});

const mapDispatchToProps = {
  changeForm: change,
  updateVariable: codebookActions.updateVariable,
  createVariable: codebookActions.createVariable,
};

const formState = connect(null, mapDispatchToProps);

export {
  formState,
  formHandlers,
};

export default compose(
  formState,
  formHandlers,
);
