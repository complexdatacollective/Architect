import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@ui/components/Fields/Text';
import ValidatedField from '@components/Form/ValidatedField';

const ScalarParameters = ({ name }) => (
  <React.Fragment>
    <p>
      This input type requires a <strong>minimum</strong> and <strong>maximum</strong> label,
      respectively corresponding to values <strong>0.000</strong> and <strong>1.000</strong>.
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
