import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { first } from 'lodash';

const makeMapStateToProps = (attributes = []) => (state, { form }) => {
  if (attributes.length > 1) {
    const values = formValueSelector(form)(state, ...attributes);

    return values;
  }

  if (!attributes.length || attributes.length === 1) {
    const attribute = attributes.length ? first(attributes) : attributes;
    const value = formValueSelector(form)(state, attribute);

    return { [attribute]: value };
  }

  return {};
};

const withFieldState = (attributes = []) => connect(makeMapStateToProps(attributes));

export default withFieldState;
