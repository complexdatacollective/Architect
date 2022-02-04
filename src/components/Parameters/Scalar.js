import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { ValidatedField } from '../Form';

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
    <ValidatedField
      label="Minimum label"
      component={TextField}
      name={`${name}.minLabel`}
      validation={{ required: true }}
    />
    <ValidatedField
      label="Maximum label"
      component={TextField}
      name={`${name}.maxLabel`}
      validation={{ required: true }}
    />
  </>
);

ScalarParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ScalarParameters;
