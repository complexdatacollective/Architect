import React from 'react';
import PropTypes from 'prop-types';
import { DATE_FORMATS } from '@codaco/ui/lib/components/Fields/DatePicker';
import Number from '@codaco/ui/lib/components/Fields/Number';
import DateField from '@components/Form/Fields/Date';
import ValidatedField from '@components/Form/ValidatedField';

const RelativeDatePickerParameters = ({ name }) => {
  const dateFormat = DATE_FORMATS.full;
  return (
    <React.Fragment>
      <p>This input type has three options for you to set.</p>
      <h4>Anchor Date</h4>
      <p>
        The anchor date defines the point that the participant selects a date relative to.
        If an anchor date is not supplied, the interview data will be used.
      </p>
      <ValidatedField
        label=""
        component={DateField}
        name={`${name}.anchor`}
        validation={{ ISODate: dateFormat }}
        dateFormat={dateFormat}
      />
      <h4>Days Before</h4>
      <p>
        Days before is the number of days prior to the anchor
        date that can be selected from.
        Defaults to 180 days if left blank.
      </p>
      <ValidatedField
        label=""
        component={Number}
        name={`${name}.before`}
      />
      <h4>Days After</h4>
      <p>
        Days after is the number of days after the anchor
        date that can be selected from.
        Defaults to 0 days if left blank.
      </p>
      <ValidatedField
        label=""
        component={Number}
        name={`${name}.after`}
      />
    </React.Fragment>
  );
};

RelativeDatePickerParameters.propTypes = {
  name: PropTypes.string.isRequired,
};

export default RelativeDatePickerParameters;
