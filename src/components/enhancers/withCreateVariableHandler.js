import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { isEmpty } from 'lodash';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';
import safeName from '../../utils/safeName';

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  deleteVariable: codebookActions.deleteVariable,
};

export const normalizeKeyDown = (event) => {
  const check = safeName(event.key);

  if (isEmpty(check)) {
    event.preventDefault();
  }
};

const createVariableHandler = {
  handleCreateVariable: ({ createVariable, type, entity }) =>
    (variableName, variableType) => {
      const withType = variableType ? { type: variableType } : {};

      const configuration = {
        name: variableName,
        ...withType,
      };

      const { variable } = createVariable(entity, type, configuration);

      return variable;
    },
  handleDeleteVariable: ({ deleteVariable, type, entity }) =>
    variableId =>
      deleteVariable(entity, type, variableId),
  normalizeKeyDown: () => normalizeKeyDown,
};

/**
  * usage:
  * withCreateVariableHandler(MyComponent)
  *
  * MyComponent = (handleCreateVariable) => (
  *   <div handler={() => handleCreateVarible(value, type)} />
  * )
  */
const withCreateVariableHandler =
  compose(
    connect(null, mapDispatchToProps),
    withHandlers(createVariableHandler),
  );

export default withCreateVariableHandler;

