import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import TextField from '@codaco/ui/lib/components/Fields/Text';

const ScalarParameters = ({ name }) => (
  <>
    <p>
      This input type requires you to
      specify a
      {' '}
      <strong>minimum</strong>
      {' '}
      and
      {' '}
      <strong>maximum</strong>
      {' '}
      label,
      which will be displayed at each end of the scale.
    </p>
    <Field
      label="Minimum label"
      component={TextField}
      name={`${name}.minLabel`}
    />
    <Field
      label="Maximum label"
      component={TextField}
      name={`${name}.maxLabel`}
    />
  </>
);

ScalarParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ScalarParameters;
