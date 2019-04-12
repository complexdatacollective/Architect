import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  deleteVariable: codebookActions.deleteVariable,
};

const createVariableHandler = {
  handleCreateVariable: ({ createVariable, type, entity }) =>
    (variableName, variableType) => {
      const configuration = {
        type: variableType,
        name: variableName,
      };

      const { variable } = createVariable(entity, type, configuration);

      return variable;
    },
  handleDeleteVariable: ({ deleteVariable, type, entity }) =>
    (variableId) => {
      const { variable } = deleteVariable(entity, type, variableId);

      return variable;
    },
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

