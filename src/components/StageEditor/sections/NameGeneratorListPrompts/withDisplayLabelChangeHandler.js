import { change } from 'redux-form';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

/**
 * Ensures that displayField isn't contained in additionalProperties.
 *
 * When displayField is updated, this handler will update additionalProperties
 * minus any matching properties.
 */
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
    change(form, `${containerFieldId}.${fieldId}`, value),
  ),
});

export { withDisplayLabelChangeHandler };

export default compose(
  connect(null, mapDispatchToProps),
  withDisplayLabelChangeHandler,
);
