import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
};

const createHandlers = {
  handleCreateOption: ({ createVariable, nodeType }) =>
    (value) => {
      const configuration = {
        type: 'text',
        name: value,
      };

      const { variable } = createVariable('node', nodeType, configuration);

      return variable;
    },
};

const withCreateHandlers = compose(
  connect(null, mapDispatchToProps),
  withHandlers(createHandlers),
);

export default withCreateHandlers;
