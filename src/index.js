import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import initReactFastclick from 'react-fastclick';

import { Provider } from 'react-redux';

import { store } from './ducks/store';
import App from './containers/App';
import AppRouter from './routes';

injectTapEventPlugin();
initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App>
        <AppRouter />
      </App>
    </Provider>,
    document.getElementById('root'),
  );
};

startApp();
