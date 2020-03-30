import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { get } from 'lodash';
import { getStageById } from '@selectors/protocol';
import { actionCreators as dialogsActions } from '../../../ducks/modules/dialogs';

const withResetState = connect(
  (state, { stageId }) => {
    const stage = getStageById(state, { stageId });
    const disabled = !!get(stage, 'subject.type', false);

    return {
      disabled,
    };
  },
  {
    openDialog: dialogsActions.openDialog,
  },
);



// resetAndChange() {
//   // this.props.onReset(null, ['id', 'type', 'label']);
//   // this.props.onChange(', ['id', 'type', 'label']);
// }

// handleResetOnChange = (name, value) => {
//   console.log({ name, value });
//   this.props.openDialog({
//     type: 'Confirm',
//     title: 'Change node type for this stage',
//     message: 'You attemped to change the node type of a stage that you have already configured. Before you can proceed the stage must be reset, which will remove any existing configuration. Do you want to reset the stage now?',
//     onConfirm: () => this.resetAndChange,
//     confirmLabel: 'Continue',
//   });
// }

const withResetHandlers = withHandlers({
  handleResetOnChange: ({ disabled, openDialog, onChange, onReset }) =>
    (name, value) => {
      const resetAndChange = () => {
        console.log('lets go');
        onReset(['id', 'type', 'label'], true);
        onChange(name, value);
      };

      openDialog({
        type: 'Confirm',
        title: 'Change node type for this stage',
        message: 'You attemped to change the node type of a stage that you have already configured. Before you can proceed the stage must be reset, which will remove any existing configuration. Do you want to reset the stage now?',
        onConfirm: resetAndChange,
        confirmLabel: 'Continue',
      });
    },
});


const withDisableAndReset = compose(
  withResetState,
  withResetHandlers,
);

export default withDisableAndReset;
