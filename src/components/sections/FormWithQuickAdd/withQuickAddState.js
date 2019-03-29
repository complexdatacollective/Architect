import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compose, withState } from 'recompose';

const withQuickAdd = connect(
  (state, { form }) => ({
    quickAdd: formValueSelector(form)(state, 'quickAdd'),
  }),
);

const withQuickAddEnabled = withState(
  'quickAddEnabled',
  'setQuickAddEnabled',
  ({ quickAdd }) => !!quickAdd,
);

const withQuickAddState = compose(
  withQuickAdd,
  withQuickAddEnabled,
);

export default withQuickAddState;
