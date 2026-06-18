import { values } from 'lodash';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { formValueSelector } from 'redux-form';

import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';
import { getVariablesForSubject } from '../../selectors/codebook';

export const form = 'create-new-variable';

const mapStateToProps = (state, { entity, type }) => {
  const variableType = formValueSelector(form)(state, 'type');
  const existingVariables = getVariablesForSubject(state, { entity, type });
  const existingVariableNames = values(existingVariables).map(
    ({ name }) => name,
  );

  return {
    variableType,
    existingVariableNames,
  };
};

const mapDispatchToProps = { createVariable: codebookActions.createVariable };

const newVariableHandlers = withHandlers({
  handleCreateNewVariable:
    ({ entity, type, createVariable, onComplete }) =>
    async (configuration) => {
      const { variable } = await createVariable(entity, type, configuration);
      onComplete(variable);
    },
});

const withNewVariableHandler = compose(
  connect(mapStateToProps, mapDispatchToProps),
  newVariableHandlers,
);

export default withNewVariableHandler;
