import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Protocol, Start } from './containers';
import { getCSSVariableAsNumber } from './utils/CSSVariables';

const routes = ({ location }) => (
  <TransitionGroup component={null}>
    <CSSTransition appear timeout={getCSSVariableAsNumber('--animation-duration-fast-ms')} classNames="route" key={location.key}>
      <Switch location={location}>
        <Route
          exact
          path="/edit/:protocol"
          component={Protocol}
        />
        <Route
          exact
          path="/"
          component={Start}
        />
        <Redirect to="/" />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
);

routes.propTypes = {
  location: PropTypes.object.isRequired,
};

export default routes;
