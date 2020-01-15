import React from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';
import { DATE_FORMATS, DATE_TYPES } from '@codaco/ui/lib/components/Fields/DatePicker';
import SelectField from '@components/Form/Fields/Select';
import ValidatedField from '@components/Form/ValidatedField';
import DateField from '@components/Form/Fields/Date';

const dateTypes = DATE_TYPES.map(type => ({
  ...type,
  label: `${type.label} (${DATE_FORMATS[type.value].toUpperCase()})`,
}));


const DateTimeParameters = ({ name, type }) => {
  const dateFormat = type ? DATE_FORMATS[type] : DATE_FORMATS.full;
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
      />
      <br />
      <h4>Start Range</h4>
      <p>
        The start range is the earliest date available for the participant to select.
        If left empty, it will default to starting at {'1970-01-01'.slice(0, dateFormat.length)}.
      </p>
      <ValidatedField
        label=""
        component={DateField}
        name={`${name}.min`}
        validation={{ ISODate: dateFormat }}
        dateFormat={dateFormat}
      />
      <br />
      <h4>End Range</h4>
      <p>
        The end range is the latest date available for the participant to select.
        If it is not supplied, the input will default to ending at the current date.
      </p>
      <ValidatedField
        label=""
        component={DateField}
        name={`${name}.max`}
        validation={{ ISODate: dateFormat }}
        dateFormat={dateFormat}
      />
    </React.Fragment>
  );
};

DateTimeParameters.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default formValues({ type: 'parameters.type' })(DateTimeParameters);
