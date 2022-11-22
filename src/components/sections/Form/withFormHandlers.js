import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change, SubmissionError } from 'redux-form';
import { getTypeForComponent } from '@app/config/variables';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { getCodebookProperties } from './helpers';
import { makeGetVariable } from '../../../selectors/codebook';

const formHandlers = withHandlers({
  handleChangeFields: ({
    updateVariable,
    createVariable,
    type,
    entity,
    changeForm,
    form,
    getVariable,
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
      const current = getVariable(variable);
      if (!current) {
        throw new SubmissionError({
          _error: 'Variable not found',
        });
      }

      const baseProps = {
        component: current.component,
        type: current.type,
        name: current.name,
      };

      // Merge is set to false below so that properties that were removed, such
      // as 'options: []' and 'parameters: {}' get deleted.
      await updateVariable(entity, type, variable, { ...baseProps, ...configuration }, false);

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

const mapStateToProps = (state) => ({
  getVariable: (uuid) => makeGetVariable(uuid)(state),
});

const formState = connect(mapStateToProps, mapDispatchToProps);

export {
  formState,
  formHandlers,
};

export default compose(
  formState,
  formHandlers,
);
