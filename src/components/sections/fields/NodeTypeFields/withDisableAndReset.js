import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { getFormValues, change } from 'redux-form';
import { get, keys, difference } from 'lodash';
import { actionCreators as dialogsActions } from '@modules/dialogs';

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
    openDialog: dialogsActions.openDialog,
  },
);

const withResetHandlers = withHandlers({
  handleResetStage: ({ disabled, openDialog, form, fields, changeForm }) =>
    () => {
      if (!disabled) { return; }

      const resetStage = () => {
        const fieldsToReset = difference(fields, ['id', 'type', 'label']);
        fieldsToReset.forEach(field => changeForm(form, field, null));
      };

      openDialog({
        type: 'Confirm',
        title: 'Change node type for this stage',
        message: 'You attemped to change the node type of a stage that you have already configured. Before you can proceed the stage must be reset, which will remove any existing configuration. Do you want to reset the stage now?',
        onConfirm: resetStage,
        confirmLabel: 'Continue',
      });
    },
});


const withDisableAndReset = compose(
  withResetState,
  withResetHandlers,
);

export default withDisableAndReset;
