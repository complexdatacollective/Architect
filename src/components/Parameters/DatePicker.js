import React from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';
import { DATE_FORMATS, DATE_TYPES } from '@ui/components/Fields/DatePicker';
import DateField from '@components/Form/Fields/Date';
import SelectField from '@components/Form/Fields/Select';
import ValidatedField from '@components/Form/ValidatedField';

const dateTypes = DATE_TYPES.map(type => ({
  ...type,
  label: `${type.label} (${DATE_FORMATS[type.value].toUpperCase()})`,
}));

const DateTimeParameters = ({ name, type }) => {
  const dateFormat = type ? DATE_FORMATS[type] : DATE_FORMATS.full;
  return (
    <React.Fragment>
      <p>
        You can select a <strong>Date Type</strong> if you would like to only select a partial date, e.g. year
        only.
      </p>
      <p>
        If a <strong>Start Range</strong> date is not supplied, the input range will default
        to starting at <strong>{'1970-01-01'.slice(0, dateFormat.length)}</strong>.
      </p>
      <p>
        If an <strong>End Range</strong> date is not supplied, the input range will default
        to ending at the <strong>current date</strong>.
      </p>
      <ValidatedField
        label="Date Type"
        component={SelectField}
        name={`${name}.type`}
        options={dateTypes}
      />
      <ValidatedField
        label="Start range"
        component={DateField}
        name={`${name}.min`}
        validation={{ ISODate: dateFormat }}
        dateFormat={dateFormat}
      />
      <ValidatedField
        label="End range"
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
};

export default formValues({ type: 'parameters.type' })(DateTimeParameters);
