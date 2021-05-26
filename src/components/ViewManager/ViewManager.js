import React from 'react';
import {
  Route,
  Switch,
  HashRouter as Router,
} from 'react-router-dom';
import App from './views/App';
import ProtocolSummary from './views/ProtocolSummary';

const ViewManager = () => (
  <Router>
    <Switch>
      <Route path="/summary" component={ProtocolSummary} />
      <Route path="/" component={App} />
    </Switch>
  </Router>
);

export default ViewManager;
