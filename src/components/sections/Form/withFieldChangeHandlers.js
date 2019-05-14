import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { values } from 'lodash';
import withSubject from '../../enhancers/withSubject';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';
import { getCodebookProperties } from './helpers';
import { getVariablesForSubject } from '../../../selectors/codebook';

const mapFormProperties = (state, { entity, type }) => {
  const existingVariables = getVariablesForSubject(state, { entity, type });
  const existingVariableNames = values(existingVariables)
    .map(({ name }) => name);

  return {
    existingVariableNames,
  };
};

const fieldChangeHandlers = withHandlers({
  handleChangeFields: ({ createVariable, updateVariable, type, entity }) =>
    ({ variable, component, ...rest }) => {
      const variableType = getTypeForComponent(component);
      // prune properties that are not part of the codebook:
      const codebookProperties = getCodebookProperties(rest);
      const configuration = {
        type: variableType,
        ...codebookProperties,
      };

      if (variable) {
        return updateVariable(entity, type, variable, configuration);
      }

      return createVariable(entity, type, configuration); // TODO: we need variable id
    },
});

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  updateVariable: codebookActions.updateVariable,
};

const withFieldChangeHandlers = compose(
  withSubject,
  connect(mapFormProperties, mapDispatchToProps),
  fieldChangeHandlers,
);

export default withFieldChangeHandlers;
