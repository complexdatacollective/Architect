import { connect } from 'react-redux';
import { pick } from 'lodash';

const makeMapStateToProps = (attributes = []) =>
  (state, { fieldId, form }) => {
    const values = form.getValues(state, fieldId);

    if (attributes.length === 0) { return values; }

    return pick(values, attributes);
  };

const withFieldState = (attributes = []) =>
  connect(makeMapStateToProps(attributes));

export default withFieldState;
