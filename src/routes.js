/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import { BrowserRouter as Router, withRouter, Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { Protocol, Start } from './containers';
import { actionCreators as sessionActions } from './ducks/modules/session';
import Routes from './routes';

const routes = ({ location }) => (
  <TransitionGroup component={null}>
    <Transition appear timeout={5000} key={location.key}>
      {(state) => (
        <Switch location={location}>
          <Route
            exact
            path="/edit/:protocol"
            render={(props) => (<Protocol {...props} state={state} />)}
          />
          <Route
            exact
            path="/"
            render={(props) => (<Start {...props} state={state} />)}
          />
          <Redirect to="/" />
        </Switch>
      )}
    </Transition>
  </TransitionGroup>
);

export default routes;
