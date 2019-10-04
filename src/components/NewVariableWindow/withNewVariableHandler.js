import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { values } from 'lodash';
import { getVariables } from '@selectors/codebook';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

export const form = 'create-new-variable';

const mapStateToProps = (state, { entity, type }) => {
  const variableType = formValueSelector(form)(state, 'type');
  const existingVariables = getVariables(state, { entity, type });
  const existingVariableNames = values(existingVariables)
    .map(({ properties }) => properties.name);

  return {
    variableType,
    existingVariableNames,
  };
};

const mapDispatchToProps = { createVariable: codebookActions.createVariable };

const newVariableHandlers = withHandlers({
  handleCreateNewVariable: ({
    entity,
    type,
    createVariable,
    onComplete,
  }) =>
    (configuration) => {
      const { variable } = createVariable(entity, type, configuration);
      onComplete(variable);
    },
});

const withNewVariableHandler = compose(
  connect(mapStateToProps, mapDispatchToProps),
  newVariableHandlers,
);

export default withNewVariableHandler;
