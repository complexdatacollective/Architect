import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import './styles/main.scss';
import { store } from './ducks/store';
import App from './containers/App';
import Routes from './routes';

injectTapEventPlugin();
initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Route
          render={({ location }) => (
            <App>
              <Routes location={location} />
            </App>
          )}
        />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
};

startApp();
