import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { pick } from 'lodash';

const makeMapStateToProps = (attributes = []) =>
  (state, { fieldId, form }) => {
    const values = formValueSelector(form)(state, fieldId);

    // If no attributes are defined, return all of them
    if (attributes.length === 0) { return values; }

    return pick(values, attributes);
  };

const withFieldState = (attributes = []) =>
  connect(makeMapStateToProps(attributes));

export default withFieldState;
