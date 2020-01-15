import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import ValidatedField from '@components/Form/ValidatedField';

const ScalarParameters = ({ name }) => (
  <React.Fragment>
    <p>
      This input type requires you to specify a <strong>minimum</strong>
      and <strong>maximum</strong> label, which will be displayed at
      each end of the scale.
    </p>
    <ValidatedField
      label="Minimum label"
      component={TextField}
      name={`${name}.minLabel`}
      r
    />
    <ValidatedField
      label="Maximum label"
      component={TextField}
      name={`${name}.maxLabel`}
    />
  </React.Fragment>
);

ScalarParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ScalarParameters;
