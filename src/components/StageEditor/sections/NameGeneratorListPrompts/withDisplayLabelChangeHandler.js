import { change } from 'redux-form';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

const withDisplayLabelChangeHandler = withHandlers({
  handleChangeDisplayLabel: ({ updateField, cardOptions }) =>
    (e, newValue) => {
      const additionalProperties = cardOptions && cardOptions.additionalProperties;
      if (!additionalProperties) { return; }

      // Remove additional display property if it matches display label.
      updateField(
        'cardOptions.additionalProperties',
        additionalProperties.filter(({ variable }) => variable !== newValue),
      );
    },
});

const mapDispatchToProps = (dispatch, { form, fieldId: containerFieldId }) => ({
  updateField: (fieldId, value) => dispatch(
    change(form.name, `${containerFieldId}.${fieldId}`, value),
  ),
});

export default compose(
  connect(null, mapDispatchToProps),
  withDisplayLabelChangeHandler,
);
