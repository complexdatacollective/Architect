import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { first, isArray } from 'lodash';

const getAsArray = (fieldOrFields = []) => (
  isArray(fieldOrFields) ? fieldOrFields : [fieldOrFields]
);

const makeMapStateToProps = (fieldOrFields = []) => (state, { form }) => {
  const fields = getAsArray(fieldOrFields);
  const valueOrValues = formValueSelector(form)(state, ...fields);

  // When formValueSelector receives a single field it returns a scalar.
  if (fields.length === 1) {
    return { [first(fields)]: valueOrValues };
  }

  return valueOrValues;
};

const withMapFormToProps = (fields = []) => connect(makeMapStateToProps(fields));

export default withMapFormToProps;
