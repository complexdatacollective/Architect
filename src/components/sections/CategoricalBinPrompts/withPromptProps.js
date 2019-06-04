import { connect } from 'react-redux';
import { change } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { pickBy, reduce } from 'lodash';
import { getVariablesForSubject } from '../../../selectors/codebook';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapStateToProps = (state, { type, entity }) => {
  const existingVariables = getVariablesForSubject(state, { type, entity });

  const variablesWithoutComponents = pickBy(existingVariables, value => !value.component);

  const variableOptions = reduce(
    variablesWithoutComponents,
    (acc, { name, type: variableType }, variableId) => ([
      ...acc,
      { type: variableType, label: name, value: variableId },
    ]),
    [],
  );

  return {
    variableOptions,
  };
};

const mapDispatchToProps = {
  changeForm: change,
  deleteVariable: codebookActions.deleteVariable,
};

const variableOptions = connect(mapStateToProps, mapDispatchToProps);

const variableHandlers = withHandlers({
  handleCreateNewVariable: ({ closeNewVariableWindow, changeForm, form }) =>
    (variable) => {
      // update form
      changeForm(form, 'variable', variable);
      closeNewVariableWindow();
    },

  handleDeleteVariable: ({ entity, type, deleteVariable }) =>
    variable => deleteVariable(entity, type, variable),
});

const withPromptProps = compose(
  variableOptions,
  variableHandlers,
);

export default withPromptProps;
