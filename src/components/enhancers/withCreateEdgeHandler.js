import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const mapDispatchToProps = {
  createVariable: codebookActions.createType,
};

const createEdgeHandler = {
  handleCreateEdge: ({ createType }) =>
    (name) => {
      const configuration = {
        name,
        color: 'edge-color-seq-1', // Calculate this, or handle in reducer
        variables: {}, // TODO, what to do about default properties? handle in reducer?
      };

      const { type } = createType('edge', configuration);

      return type;
    },
};

/**
  * usage:
  * withCreateEdgeHandler(MyComponent)
  *
  * MyComponent = (handleCreateEdge) => (
  *   <div handler={() => handleCreateEdge(name)} />
  * )
  */

const withCreateEdgeHandler =
  compose(
    connect(null, mapDispatchToProps),
    withHandlers(createEdgeHandler),
  );

export default withCreateEdgeHandler;

