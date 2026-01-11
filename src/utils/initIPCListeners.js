import { isDirty } from 'redux-form';
import { electronAPI } from '@utils/electronBridge';
import { store } from '@app/ducks/store';
import { getHasUnsavedChanges } from '@selectors/session';
import { actionCreators as userActions } from '@modules/userActions';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { formName } from '@components/StageEditor/StageEditor';
import { UnsavedChanges } from '@components/Dialogs';

const initIPCListeners = () => {
  electronAPI.ipc.on('SAVE_COPY', () => {
    store.dispatch(userActions.saveAsNetcanvas());
  });

  electronAPI.ipc.on('OPEN', () => {
    store.dispatch(userActions.openNetcanvas());
  });

  electronAPI.ipc.on('SAVE', () => {
    store.dispatch(userActions.saveNetcanvas());
  });

  electronAPI.ipc.on('PRINT_SUMMARY', () => {
    store.dispatch(userActions.printOverview());
  });

  electronAPI.ipc.on('CONFIRM_CLOSE', () => {
    const state = store.getState();
    const hasUnsavedChanges = getHasUnsavedChanges(state);
    const hasDraftChanges = isDirty(formName)(state);

    electronAPI.ipc.send('CONFIRM_CLOSE_ACK');

    if (!hasUnsavedChanges && !hasDraftChanges) {
      electronAPI.ipc.send('QUIT');
      return;
    }

    store.dispatch(dialogActions.openDialog(UnsavedChanges({
      confirmLabel: 'Exit application',
    })))
      .then((confirm) => {
        if (confirm) { electronAPI.ipc.send('QUIT'); }
      });
  });
};

export default initIPCListeners;
