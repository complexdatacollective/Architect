import React from 'react';
import { Router, Route } from 'react-router-dom';
import appHistory from '@app/history';
import Home from '@components/Home/Home';
import Protocol from '@components/Protocol';
import ProtocolLoader from '@components/ProtocolLoader';
import Loading from '@components/Loading';
import Screens from '@components/Screens';

const Routes = () => (
  <Router history={appHistory}>
    <Loading />
    <Screens />
    <Route path="/" exact>
      <Home />
    </Route>
    <Route path="/edit/:protocol">
      <ProtocolLoader />
      <Protocol />
    </Route>
  </Router>
);

export { Routes };

export default Routes;
