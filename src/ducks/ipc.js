import { ipcRenderer } from 'electron';

const ipc = (store) => {
  ipcRenderer.on('ACTION', (event, action) => {
    store.dispatch({ ...action, meta: { ...action.meta, sender: event.sender } });
  });

  return next => action => next(action);
};

export default ipc;
