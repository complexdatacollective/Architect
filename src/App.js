import React from 'react';
import {
  Route,
  Switch,
  HashRouter as Router,
} from 'react-router-dom';
import Main from './views/Main';
import ProtocolSummary from './views/ProtocolSummary';

const App = () => (
  <Router>
    <Switch>
      <Route path="/summary" component={ProtocolSummary} />
      <Route path="/" component={Main} />
    </Switch>
  </Router>
);

export default App;
