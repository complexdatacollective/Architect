import { connect } from 'react-redux';
import { compose } from 'recompose';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form }) => {
  const quickAdd = formValueSelector(form)(state, 'quickAdd');

  return {
    quickAdd,
  };
};

const withQuickAddState = connect(mapStateToProps);

const withQuickAddVariable = compose(withQuickAddState);

export default withQuickAddVariable;
