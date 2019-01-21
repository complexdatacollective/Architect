import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ActionCreators as undoActions } from 'redux-undo';
import Mousetrap from 'mousetrap';
import appHistory from './history';
import { store, persistor } from './ducks/store';
import App from './components/App';
import Routes from './routes';
import ClipPaths from './components/ClipPaths';
import initPreventFileDrop from './utils/initPreventFileDrop';
import initFileOpener from './utils/initFileOpener';

import './styles/main.scss';

initPreventFileDrop();
initReactFastclick();

const bindShortcuts = () => {
  Mousetrap.bind('command+z', () => store.dispatch(undoActions.undo()));
  Mousetrap.bind('command+shift+z', () => store.dispatch(undoActions.redo()));
};

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

window.addEventListener('load', () => {
  startApp();
  initFileOpener();
  bindShortcuts();
});
