import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector, change, Field } from 'redux-form';
import { DATE_FORMATS } from '@codaco/ui/lib/components/Fields/DatePicker';
import Number from '@codaco/ui/lib/components/Fields/Number';
import Toggle from '@codaco/ui/lib/components/Fields/Toggle';
import ValidatedField from '@components/Form/ValidatedField';
import { DatePicker } from '@codaco/ui/lib/components/Fields';

const RelativeDatePickerParameters = ({ name, anchorValue, resetField }) => {
  const dateFormat = DATE_FORMATS.full;
  const [useInterviewDate, setUseInterviewDate] = useState(!anchorValue);
  return (
    <>
      <h4>Anchor Date</h4>
      <p>
        The anchor date defines the point that the participant can select a date relative to.
        You can choose to either use the interview date, or specify a specific date manually. When
        using the interview date, the date will be set dynamically based on when your interview
        is conducted.
      </p>
      <Toggle
        input={{
          checked: !!useInterviewDate,
          value: useInterviewDate,
          onChange: (event) => {
            // Use event rather than state here because we are also changing state in this function.
            if (event.target.checked) {
              resetField();
            }
            setUseInterviewDate(!!event.target.checked);
          },
        }}
        label="Use interview date"
        fieldLabel=" "
      />
      { !useInterviewDate
      && (
      <ValidatedField
        label="Specific Anchor Date"
        component={DatePicker}
        name={`${name}.anchor`}
        validation={{ required: !useInterviewDate, ISODate: dateFormat }}
        dateFormat={dateFormat}
        parameters={{
          min: '1000-01-01',
          max: '3000-01-01',
        }}
      />
      )}
      <h4>Days Before</h4>
      <p>
        Days before is the number of days prior to the anchor
        date that can be selected from.
        Defaults to 180 days if left blank.
      </p>
      <Field
        label=""
        component={Number}
        name={`${name}.before`}
        placeholder="180"
      />
      <h4>Days After</h4>
      <p>
        Days after is the number of days after the anchor
        date that can be selected from.
        Defaults to 0 days if left blank.
      </p>
      <Field
        label=""
        component={Number}
        name={`${name}.after`}
        placeholder="0"
      />
    </>
  );
};

RelativeDatePickerParameters.propTypes = {
  name: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
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
