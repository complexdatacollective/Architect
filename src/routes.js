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

const RedirectToDashboard = () => <Redirect to="/" />;

const routes = ({ activeProtocol }) => (
  <Switch>
    <Route
      exact
      path="/edit/"
      render={() => (activeProtocol ? <Protocol /> : <RedirectToDashboard />)}
    />,
    <Route exact path="/" component={Start} />,
    <RedirectToDashboard />,
  </Switch>
);

routes.propTypes = {
  activeProtocol: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  activeProtocol: !!state.session.activeProtocol,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
)(routes);
