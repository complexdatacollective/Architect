import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
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
  ReactDOM.render(
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ViewManager />
        </PersistGate>
      </Provider>
    </>,
    document.getElementById('root'),
  );
};

window.addEventListener('load', () => {
  startApp();
  initFileOpener();
});
