import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@ui/components/Fields/Text';
import ValidatedField from '@components/Form/ValidatedField';

const ScalarParameters = ({ name }) => (
  <React.Fragment>
    <ValidatedField
      label="Minimum label"
      component={TextField}
      name={`${name}.minLabel`}
      r
    />
    <ValidatedField
      label="Maxium label"
      component={TextField}
      name={`${name}.maxLabel`}
    />
  </React.Fragment>
);

ScalarParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ScalarParameters;
