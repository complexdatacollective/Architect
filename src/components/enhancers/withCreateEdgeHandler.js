import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { change } from 'redux-form';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

// TODO: withCreateEdgeType

const mapDispatchToProps = {
  changeField: change,
  createEdge: codebookActions.createEdge,
};

const createEdgeHandler = {
  handleCreateEdge: ({ changeField, createEdge, form }) => (name) => {
    const { type } = createEdge({ name });

    // Update select field to newly created edge
    changeField(form, 'edges.create', type);

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
