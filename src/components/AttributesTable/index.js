import React from 'react';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import AttributesTable from './AttributesTable';
import withValidation from './withValidation';

const AttributesTableContainer = props => (
  <Field
    component={AttributesTable}
    {...props}
  />
);

export default compose(
  withValidation,
)(AttributesTableContainer);

