import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { ipcRenderer, remote } from 'electron';
import pathToRegexp from 'path-to-regexp';
import { get } from 'lodash';
import './styles/main.scss';
import memoryHistory from './history';
import { store } from './ducks/store';
import App from './components/App';
import Routes from './routes';
import ClipPaths from './components/ClipPaths';
import { actionCreators as fileActionCreators } from './ducks/modules/protocol/file';

initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    <Fragment>
      <ClipPaths />
      <Provider store={store}>
        <Router history={memoryHistory}>
          <Route
            render={({ location, history }) => (
              <App>
                <Routes location={location} history={history} />
              </App>
            )}
          />
        </Router>
      </Provider>
    </Fragment>,
    document.getElementById('root'),
  );
};

startApp();

const getProtocol = (location) => {
  const re = pathToRegexp('/edit/:protocol');
  const matches = re.exec(location);
  if (!matches) { return undefined; }
  return get(matches, 1);
};

ipcRenderer.on('OPEN_FILE', (event, protocolPath) => {
  const protocolLocation = `/edit/${encodeURIComponent(protocolPath)}`;
  const currentProtocol = getProtocol(memoryHistory.location.pathname);
  // If the protocol is already open, no op
  if (encodeURIComponent(protocolPath) === currentProtocol) { return; }
  // If no protocol is already open, just open it.
  if (!currentProtocol) { memoryHistory.push(protocolLocation); return; }

  remote.dialog.showMessageBox({
    type: 'question',
    message: `Attempting to open protocol "${protocolPath}"`,
    buttons: ['Save and continue', 'Cancel'],
  }, (response) => {
    if (response !== 0) {
      // eslint-disable-next-line
      console.log(`Cancelled open of "${protocolPath}"`);
      return;
    }

    // eslint-disable-next-line
    console.log(`Save, then open "${protocolPath}"`);
    store.dispatch(fileActionCreators.saveProtocol())
      .then(() => memoryHistory.push(protocolLocation));
  });
});

ipcRenderer.send('GET_ARGF');
