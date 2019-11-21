import React from 'react';
import TextField from '@ui/components/Fields/Text';
import ValidatedField from '@components/Form/ValidatedField';

const ScalarParameters = ({
  name,
}) => (
  <div>
    <ValidatedField
      label="Min label"
      component={TextField}
      name={`${name}.minLabel`}
      r
    />
    <ValidatedField
      label="Max label"
      component={TextField}
      name={`${name}.maxLabel`}
    />
  </div>
);

export default ScalarParameters;
