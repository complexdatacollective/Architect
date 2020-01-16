import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { DATE_FORMATS } from '@codaco/ui/lib/components/Fields/DatePicker';
import Number from '@codaco/ui/lib/components/Fields/Number';
import Toggle from '@codaco/ui/lib/components/Fields/Toggle';
import DateField from '@components/Form/Fields/Date';
import ValidatedField from '@components/Form/ValidatedField';

const RelativeDatePickerParameters = ({ name, anchorValue, resetField }) => {
  const dateFormat = DATE_FORMATS.full;
  const [useInterviewDate, setUseInterviewDate] = useState(!anchorValue);
  return (
    <React.Fragment>
      <p>This input type has three options for you to set.</p><br />
      <h4>Anchor Date</h4>
      <p>
        The anchor date defines the point that the participant selects a date relative to.
        You can choose to either use the interview date, or specify a specific date manually.
      </p>
      <Toggle
        input={{
          checked: !!useInterviewDate,
          value: useInterviewDate,
          onChange: () => {
            if (useInterviewDate) {
              resetField();
            }
            setUseInterviewDate(!useInterviewDate);
          },
        }}
        label="Use interview date"
        fieldLabel=" "
      />
      <ValidatedField
        label="Specific Anchor Date"
        component={DateField}
        name={`${name}.anchor`}
        validation={{ required: !useInterviewDate, ISODate: dateFormat }}
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
  anchorValue: PropTypes.string,
};

RelativeDatePickerParameters.defaultProps = {
  anchorValue: null,
};

const mapStateToProps = (state, { name, form }) => ({
  anchorValue: formValueSelector(form)(state, `${name}.anchor`),
});

const mapDispatchToProps = (dispatch, { name, form }) => ({
  resetField: () => dispatch(change(form, `${name}.anchor`, null)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(RelativeDatePickerParameters);
