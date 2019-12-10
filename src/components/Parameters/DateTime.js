import React from 'react';
import PropTypes from 'prop-types';
import NumberField from '@ui/components/Fields/Number';
import SelectField from '@components/Form/Fields/Select';
import ValidatedField from '@components/Form/ValidatedField';

const DateTimeParameters = ({ name }) => (
  <React.Fragment>
    <p>
      This input type requires a <strong>minimum</strong> and <strong>maximum</strong> label,
      respectively corresponding to values <strong>0.000</strong> and <strong>1.000</strong>.
    </p>
    <ValidatedField
      label="Type"
      component={SelectField}
      name={`${name}.type`}
      options={['full', 'month', 'year']}
    />
    <ValidatedField
      label="Minimum label"
      component={NumberField}
      name={`${name}.min`}
    />
    <ValidatedField
      label="Maximum label"
      component={NumberField}
      name={`${name}.max`}
    />
  </React.Fragment>
);

DateTimeParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DateTimeParameters;
