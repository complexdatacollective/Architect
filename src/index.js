import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import './styles/main.scss';
import { store } from './ducks/store';
import App from './components/App';
import Routes from './routes';
import ClipPaths from './components/ClipPaths';

injectTapEventPlugin();
initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    [
      <ClipPaths />,
      <Provider store={store}>
        <Router>
          <Route
            render={({ location, history }) => (
              <App>
                <Routes location={location} history={history} />
              </App>
            )}
          />
        </Router>
      </Provider>,
    ],
    document.getElementById('root'),
  );
};

startApp();
