import React from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {
  Start,
} from './containers';


export default () => (
  <Router>
    <Switch>
      <Route path="/start" component={Start} />
      <Redirect to={{ pathname: '/start' }} />
    </Switch>
  </Router>
);
