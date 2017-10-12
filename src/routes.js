import React from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {
  Interview,
} from './containers';

export default () => (
  <Router>
    <Switch>
      <Route path="/interview" component={Interview} />
      <Redirect to={{ pathname: '/interview' }} />
    </Switch>
  </Router>
);
