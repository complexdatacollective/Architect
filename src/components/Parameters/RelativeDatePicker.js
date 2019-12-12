import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import { DATE_FORMATS } from '@ui/components/Fields/DatePicker';
import DateField from '@components/Form/Fields/Date';
import LikertScale from '@ui/components/Fields/LikertScale';
import ValidatedField from '@components/Form/ValidatedField';

const monthRange = range(1, 25).map(v => ({ label: v, value: v }));

const RelativeDatePickerParameters = ({ name }) => {
  const dateFormat = DATE_FORMATS.full;
  return (
    <React.Fragment>
      <p>
        If an <strong>Anchor date</strong> is not supplied the field will anchor
        to the date at the <strong>time of interview</strong>.
      </p>
      <p>
        <strong>Months before</strong> is the number of months prior to the anchor
        date that can be selected from, rounded to start of month.
      </p>
      <p>
        <strong>Months after</strong> is the number of months after the anchor
        date that can be selected from, rounded to end of month.
      </p>
      <ValidatedField
        label="Anchor date"
        component={DateField}
        name={`${name}.min`}
        validation={{ ISODate: dateFormat }}
        dateFormat={dateFormat}
      />
      <ValidatedField
        label="Months before"
        component={LikertScale}
        name={`${name}.before`}
        type="ordinal"
        options={monthRange}
      />
      <ValidatedField
        label="Months after"
        component={LikertScale}
        name={`${name}.after`}
        type="ordinal"
        options={monthRange}
      />
    </React.Fragment>
  );
};

RelativeDatePickerParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default RelativeDatePickerParameters;
