import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { getFormValues, change } from 'redux-form';
import { get, keys, difference } from 'lodash';

const withResetState = connect(
  (state, { form }) => {
    const stage = getFormValues(form)(state);
    const disabled = !!get(stage, 'subject.type', false);

    return {
      fields: keys(stage),
      disabled,
    };
  },
  {
    changeForm: change,
  },
);

const withResetHandlers = withHandlers({
  handleResetStage: ({
    disabled, form, fields, changeForm,
  }) => () => {
    if (!disabled) { return; }

    const resetStage = () => {
      const fieldsToReset = difference(fields, ['id', 'type', 'label']);
      fieldsToReset.forEach((field) => changeForm(form, field, null));
    };

    resetStage();
  },
});

const withDisableAndReset = compose(
  withResetState,
  withResetHandlers,
);

export default withDisableAndReset;
