import { ipcRenderer } from 'electron';

const ipc = (store) => {
  ipcRenderer.on('ACTION', (event, { target, ...action }) => {
    const ipcAction = {
      ...action,
      meta: { ...action.meta, sender: event.sender },
    };

    store.dispatch(ipcAction);
  });

  return next => action => next(action);
};

export default ipc;
