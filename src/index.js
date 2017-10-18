import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import { store } from './ducks/store';
import App from './containers/App';
import AppRoutes from './routes';

injectTapEventPlugin();
initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App>
          <AppRoutes />
        </App>
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
};

startApp();
