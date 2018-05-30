import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import './styles/main.scss';
import memoryHistory from './history';
import { store } from './ducks/store';
import App from './components/App';
import Routes from './routes';
import ClipPaths from './components/ClipPaths';

injectTapEventPlugin();
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

ipcRenderer.on('OPEN_FILE', (event, filePath) => {
  const fileLocation = `/edit/${encodeURIComponent(filePath)}`;
  const currentLocation = memoryHistory.location.pathname;
  if (currentLocation === fileLocation) { return; }
  memoryHistory.push(fileLocation);
});

ipcRenderer.send('GET_ARGF');
