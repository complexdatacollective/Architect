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
        <strong>Days before</strong> is the number of days prior to the anchor
        date that can be selected from.
        Defaults to <strong>180 days</strong> if left blank.
      </p>
      <p>
        <strong>Days after</strong> is the number of days after the anchor
        date that can be selected from.
        Defaults to <strong>0 days</strong> if left blank.
      </p>
      <ValidatedField
        label="Anchor date"
        component={DateField}
        name={`${name}.min`}
        validation={{ ISODate: dateFormat }}
        dateFormat={dateFormat}
      />
      <ValidatedField
        label="Days before"
        component={LikertScale}
        name={`${name}.before`}
        type="ordinal"
        options={monthRange}
      />
      <ValidatedField
        label="Days after"
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
