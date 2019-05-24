import { ipcRenderer } from 'electron';
import { store } from '../ducks/store';
import { actionCreators as dialogActions } from '../ducks/modules/dialogs';

const initFileOpener = () => {
  ipcRenderer.on('CONFIRM_CLOSE', () => {
    store.dispatch(
      dialogActions.openDialog({
        type: 'Confirm',
        title: 'Are you really sure that you want to do this?',
        message: 'Like really really sure?',
        confirmLabel: 'Yes please!',
        onConfirm: () => {
          ipcRenderer.send('QUIT');
        },
      }),
    );
  });
};

export default initFileOpener;
