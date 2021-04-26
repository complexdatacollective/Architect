import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compose } from 'recompose';

const mapStateToProps = (state, { form }) => {
  const quickAdd = formValueSelector(form)(state, 'quickAdd');

  return {
    quickAdd,
  };
};

const withQuickAddState = connect(mapStateToProps);

const withQuickAddVariable = compose(
  withQuickAddState,
);

export default withQuickAddVariable;
