import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import ViewManager from './components/ViewManager/ViewManager';
import { persistor, store } from './ducks/store';
import initFileOpener from './utils/initFileOpener';
import initIPCListeners from './utils/initIPCListeners';
import initPreventFileDrop from './utils/initPreventFileDrop';

import './styles/main.scss';

initIPCListeners();
initPreventFileDrop();

const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ViewManager />
      </PersistGate>
    </Provider>,
    document.getElementById('root'),
  );
};

window.addEventListener('load', () => {
  startApp();
  initFileOpener();
});
