import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './ducks/store';
import ViewManager from './components/ViewManager/ViewManager';
import initPreventFileDrop from './utils/initPreventFileDrop';
import initIPCListeners from './utils/initIPCListeners';
import initFileOpener from './utils/initFileOpener';

import './styles/main.scss';

initIPCListeners();
initPreventFileDrop();

const startApp = () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ViewManager />
      </PersistGate>
    </Provider>
  );
  
  // Signal to main process that renderer is ready
  if (window.electronAPI) {
    window.electronAPI.ready();
  }
};

window.addEventListener('load', () => {
  startApp();
  initFileOpener();
});
