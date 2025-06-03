import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compose, withState } from 'recompose';

const edgesState = connect(
  (state, props) => {
    const getFormValues = formValueSelector(props.form);
    const createEdge = getFormValues(state, 'edges.create');

    return {
      createEdge,
    };
  },
);

const edgesToggleState = withState(
  'canCreateEdge',
  'setCanCreateEdge',
  ({ createEdge }) => !!createEdge,
);

const withCreateEdgesState = compose(
  edgesState,
  edgesToggleState,
);

export default withCreateEdgesState;
