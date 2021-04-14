import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change, SubmissionError } from 'redux-form';
import { getTypeForComponent } from '@app/config/variables';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { getCodebookProperties } from './helpers';

const formHandlers = withHandlers({
  handleChangeFields: ({
    updateVariable,
    createVariable,
    type,
    entity,
    changeForm,
    form,
  }) => async (values) => {
    const {
      variable, component, _createNewVariable, ...rest
    } = values;
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
      // Merge is set to false below so that properties that were removed, such
      // as 'options: []' and 'parameters: {}' get deleted.
      await updateVariable(entity, type, variable, configuration, true);

      return {
        variable,
        ...rest,
      };
    }

    return createVariable(
      entity,
      type,
      {
        ...configuration,
        name: _createNewVariable,
      },
    ).then(({ variable: newVariable }) => ({
      variable: newVariable,
      ...rest,
    })).catch((e) => {
      throw new SubmissionError({ variable: e.toString() });
    });
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
