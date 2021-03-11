import { ipcRenderer } from 'electron';

/**
 * Connect a listener to the IPC channel 'ACTION'. These events are treated
 * as redux actions.
 *
 * e.g.
 *
 * window.webContents.send('ACTION', { type: 'UPDATE_FOO', foo: 'bar' });
 *
 * becomes:
 *
 * dispatch({ type: 'UPDATE_FOO', foo: 'bar', meta: { sender: referenceToIPCSender} });
 */
const ipc = (store) => {
  ipcRenderer.on('ACTION', (event, { target, ...action }) => {
    const ipcAction = {
      ...action,
      meta: { ...action.meta, sender: event.sender },
    };

    store.dispatch(ipcAction);
  });

  return (next) => (action) => {
    if (action.ipc === true) {
      ipcRenderer.send('ACTION', action);
    }

    return next(action);
  };
};

export default ipc;
