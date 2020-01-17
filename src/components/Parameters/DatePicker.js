import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';
import { DATE_FORMATS, DATE_TYPES } from '@codaco/ui/lib/components/Fields/DatePicker';
import SelectField from '@components/Form/Fields/Select';
import ValidatedField from '@components/Form/ValidatedField';
import { DatePicker } from '@codaco/ui/lib/components/Fields';

const dateTypes = DATE_TYPES.map(type => ({
  ...type,
  label: `${type.label} (${DATE_FORMATS[type.value].toUpperCase()})`,
}));


const DateTimeParameters = ({ name, type }) => {
  const dateFormat = DATE_FORMATS[type] || DATE_FORMATS.full;
  const [useDateFormat, setUseDateFormat] = useState(type);

  return (
    <React.Fragment>
      <p>This input type has three options for you to set.</p>
      <h4>Date Resolution</h4>
      <p>
        Date resolution controls the precision of the measurement. By default, this input
        will ask for a year, a month, and a day. You may optionally choose to collect only a
        year and a month, or only a year.
      </p>
      <ValidatedField
        label=""
        component={SelectField}
        name={`${name}.type`}
        options={dateTypes}
        validation={{ required: true }}
        onChange={(_, value) => {
          setUseDateFormat(value);
        }}
      />
      <br />
      <h4>Start Range</h4>
      <p>
        The start range is the earliest date available for the participant to select.
        If left empty, it will default to starting at {'1970-01-01'.slice(0, dateFormat.length)}.
      </p>
      <ValidatedField
        label=""
        component={DatePicker}
        name={`${name}.min`}
        validation={{ ISODate: dateFormat }}
        parameters={{
          type: useDateFormat,
          min: '1000-01-01',
          max: '3000-12-31',
        }}
      />
      <br />
      <h4>End Range</h4>
      <p>
        The end range is the latest date available for the participant to select.
        If it is not supplied, the input will default to ending at the current date.
      </p>
      <ValidatedField
        label=""
        component={DatePicker}
        name={`${name}.max`}
        validation={{ ISODate: dateFormat }}
        parameters={{
          type: useDateFormat,
          min: '1000-01-01',
          max: '3000-12-31',
        }}
      />
    </React.Fragment>
  );
};

DateTimeParameters.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};

DateTimeParameters.defaultProps = {
  type: 'full',
};

export default formValues({ type: 'parameters.type' })(DateTimeParameters);
