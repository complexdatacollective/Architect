import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const mapDispatchToProps = {
  createEdge: codebookActions.createEdge,
};

const createEdgeHandler = {
  handleCreateEdge: ({ createEdge }) =>
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
const withCreateEdgeHandler =
  compose(
    connect(null, mapDispatchToProps),
    withHandlers(createEdgeHandler),
  );

export default withCreateEdgeHandler;

