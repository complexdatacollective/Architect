import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, Transition } from 'react-transition-group';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Protocol, Start } from './containers';

const routes = ({ location }) => (
  <TransitionGroup component={null}>
    <Transition appear timeout={5000} key={location.key}>
      {state => (
        <Switch location={location}>
          <Route
            exact
            path="/edit/:protocol"
            render={props => (<Protocol {...props} state={state} />)}
          />
          <Route
            exact
            path="/"
            render={props => (<Start {...props} state={state} />)}
          />
          <Redirect to="/" />
        </Switch>
      )}
    </Transition>
  </TransitionGroup>
);

routes.propTypes = {
  location: PropTypes.object.isRequired,
};

export default routes;
