import React from 'react';
import {
  Route,
  Switch,
  HashRouter as Router,
} from 'react-router-dom';
import App from './views/App';

const ViewManager = () => (
  <Router>
    <Switch>
      <Route path="/" component={App} />
    </Switch>
  </Router>
);

export default ViewManager;
