import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
};

const createVariableHandler = {
  handleCreateVariable: ({ createVariable, nodeType }) =>
    (value, variableType) => {
      const configuration = {
        type: variableType,
        name: value,
      };

      const { variable } = createVariable('node', nodeType, configuration);

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

