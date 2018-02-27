import React from 'react';
import {
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {
  Protocol,
  Start,
} from './containers';

export default () => (
  <Switch>
    <Route exact path="/edit/" component={Protocol} />
    <Route exact path="/" component={Start} />
    <Redirect to={{ pathname: '/' }} />
  </Switch>
);
