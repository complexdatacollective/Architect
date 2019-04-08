import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  deleteVariable: codebookActions.deleteVariable,
};

const createVariableHandler = {
  handleCreateVariable: ({ createVariable, nodeType }) =>
    (variableName, variableType) => {
      const configuration = {
        type: variableType,
        name: variableName,
      };

      const { variable } = createVariable('node', nodeType, configuration);

      return variable;
    },
  handleDeleteVariable: ({ deleteVariable, nodeType }) =>
    (variableId) => {
      const { variable } = deleteVariable('node', nodeType, variableId);

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

