/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  withRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {
  Protocol,
  Start,
} from './containers';

const routes = ({ isProtocolLoaded, locationFoo }) => (
  <Switch location={locationFoo}>
    <Route
      exact
      path="/edit/"
      render={() => (isProtocolLoaded ? <Protocol /> : <Redirect to="/" />)}
    />
    <Route
      exact
      path="/"
      render={() => (!isProtocolLoaded ? <Start /> : <Redirect to="/edit/" />)}
    />
    <Redirect to="/" />
  </Switch>
);

routes.propTypes = {
  isProtocolLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isProtocolLoaded: !!state.session.activeProtocol,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
)(routes);
