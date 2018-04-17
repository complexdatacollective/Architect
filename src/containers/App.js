/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {
  Protocol,
  Start,
} from '../containers';
import { actionCreators as sessionActions } from '../ducks/modules/session';
import AppRoutes from '../routes';

const isAtIndex = pathname => pathname === '/';

const App = ({ isProtocolLoaded, location: { pathname }, resetActiveProtocol }) => {
  const appClasses = cx(
    'app',
    {
      'app--start': isAtIndex(pathname),
    },
  );

  return (
    <Route render={({ location }) => (
      <div className={appClasses}>
        <div className="app__home" onClick={resetActiveProtocol} />
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
      </div>
    )} />
  );
};

App.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object.isRequired,
  resetActiveProtocol: PropTypes.func.isRequired,
};

App.defaultProps = {
  children: null,
};

const mapStateToProps = state => ({
  isProtocolLoaded: !!state.session.activeProtocol,
});

const mapDispatchToProps = dispatch => ({
  resetActiveProtocol: bindActionCreators(protocolActions.resetProtocol, dispatch),
});

export { App };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
