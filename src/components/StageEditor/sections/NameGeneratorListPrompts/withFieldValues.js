import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

const makeMapStateToProps = (attributes = []) =>
  (state, { form }) => {
    if (attributes.length === 0) { return {}; }

    const values = formValueSelector(form)(state, ...attributes);

    return values;
  };

const withFieldState = (attributes = []) =>
  connect(makeMapStateToProps(attributes));

export default withFieldState;
