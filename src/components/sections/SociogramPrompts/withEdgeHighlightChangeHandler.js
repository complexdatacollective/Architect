import {
  compose,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

const edgeHighlightState = connect(null, { changeForm: change });

const edgeHighlightChangeHandler = withHandlers({
  handleEdgeHighlightChange: ({ changeForm, form }) => () => {
    changeForm(form, 'highlight', { allowHighlighting: false });
    changeForm(form, 'edges.create', null);
  },
});

const withEdgeHighlightChangeHandler = compose(
  edgeHighlightState,
  edgeHighlightChangeHandler,
);

export default withEdgeHighlightChangeHandler;
