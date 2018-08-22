import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { ipcRenderer, remote } from 'electron';
import { find } from 'lodash';
import { PersistGate } from 'redux-persist/integration/react';
import './styles/main.scss';
import appHistory from './history';
import { store, persistor } from './ducks/store';
import App from './components/App';
import Routes from './routes';
import ClipPaths from './components/ClipPaths';
import { actionCreators as protocolsActions } from './ducks/modules/protocols';

initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    <Fragment>
      <ClipPaths />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router history={appHistory}>
            <Route
              render={({ location, history }) => (
                <App>
                  <Routes location={location} history={history} />
                </App>
              )}
            />
          </Router>
        </PersistGate>
      </Provider>
    </Fragment>,
    document.getElementById('root'),
  );
};

startApp();

ipcRenderer.on('OPEN_FILE', (event, protocolPath) => {
  // eslint-disable-next-line no-console
  console.log(`Open file "${protocolPath}"`);
  const state = store.getState();
  const activeProtocolId = state.session.activeProtocol;
  const meta = find(state.protocols, ['id', activeProtocolId]);

  // If the protocol is already open, no op
  if (meta && meta.filePath === protocolPath) {
    // eslint-disable-next-line no-console
    console.log(`Cancelled open of "${protocolPath}" (already open)`);
    return;
  }

  // If no protocol is already open, just open it.
  if (!activeProtocolId) {
    // eslint-disable-next-line no-console
    console.log(`Nothing open, open without asking"${protocolPath}"`);
    store.dispatch(protocolsActions.importAndLoadProtocol(protocolPath));
    return;
  }

  remote.dialog.showMessageBox({
    type: 'question',
    message: `Attempting to open protocol "${protocolPath}"`,
    buttons: ['Save and continue', 'Cancel'],
  }, (response) => {
    if (response !== 0) {
      // eslint-disable-next-line
      console.log(`Cancelled open of "${protocolPath}" (user choice)`);
      return;
    }

    // eslint-disable-next-line
    console.log(`Save, then open "${protocolPath}"`);
    store.dispatch(protocolsActions.saveAndExportProtocol())
      .then(() => store.dispatch(protocolsActions.importAndLoadProtocol(protocolPath)));
  });
});

ipcRenderer.send('GET_ARGF');
