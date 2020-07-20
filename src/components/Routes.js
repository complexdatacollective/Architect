import React from 'react';
import { Router, Route } from 'react-router-dom';
import appHistory from '@app/history';
import Home from '@components/Home/Home';
import Scene from '@components/Scene';
import ProtocolLoader from '@components/ProtocolLoader';

const Routes = () => (
  <Router history={appHistory}>
    <Route path="/" exact>
      <Home />
    </Route>
    <Route path="/edit/:protocol">
      <ProtocolLoader />
      <Scene />
    </Route>
  </Router>
);

export { Routes };

export default Routes;
