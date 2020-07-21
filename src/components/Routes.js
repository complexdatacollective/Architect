import React from 'react';
import { Router, Route } from 'react-router-dom';
import appHistory from '@app/history';
import Home from '@components/Home/Home';
import Scene from '@components/Scene';
import ProtocolLoader from '@components/ProtocolLoader';
import Loading from '@components/Loading';

const Routes = () => (
  <Router history={appHistory}>
    <Loading />
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
