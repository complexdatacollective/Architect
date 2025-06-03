import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { compose, withState, withHandlers } from 'recompose';

const withQuickAddState = connect(
  (state, { form }) => ({
    quickAdd: formValueSelector(form)(state, 'quickAdd'),
  }),
  { changeForm: change },
);

const withQuickAddEnabled = withState(
  'quickAddEnabled',
  'setQuickAddEnabled',
  ({ quickAdd }) => !!quickAdd,
);

const withQuickAddHandlers = withHandlers({
  handleChangeQuickAdd: ({
    setQuickAddEnabled,
    quickAddEnabled,
    form,
    changeForm,
  }) => () => {
    setQuickAddEnabled(!quickAddEnabled);
    changeForm(form, 'form', null);
    changeForm(form, 'quickAdd', null);
  },
});

const withQuickAdd = compose(
  withQuickAddState,
  withQuickAddEnabled,
  withQuickAddHandlers,
);

export default withQuickAdd;
