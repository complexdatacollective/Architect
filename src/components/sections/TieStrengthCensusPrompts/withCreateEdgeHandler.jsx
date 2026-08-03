import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

const mapDispatchToProps = {
  createEdge: codebookActions.createEdge,
};

// TODO: This should be the top level withCreateEdgeHandler enhancer but currently
// contains an edge case for sociogram

const createEdgeHandler = {
  handleCreateEdge:
    ({ createEdge }) =>
    (name) => {
      const { type } = createEdge({ name });

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
const withCreateEdgeHandler = compose(
  connect(null, mapDispatchToProps),
  withHandlers(createEdgeHandler),
);

export default withCreateEdgeHandler;
