/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import { BrowserRouter as Router, withRouter, Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { Protocol, Start } from '../containers';
import { actionCreators as sessionActions } from '../ducks/modules/session';
// import Routes from '../routes';

const isAtIndex = pathname => pathname === '/';

const App = ({ children, location: { pathname }, resetActiveProtocol }) => {
  const appClasses = cx(
    'app',
    {
      'app--start': isAtIndex(pathname),
    },
  );

  return (
    <div className={appClasses}>
      <NavLink className="app__home" to="/" exact />
      { children }
    </div>
  );
};

App.propTypes = {
  location: PropTypes.object.isRequired,
  resetActiveProtocol: PropTypes.func.isRequired,
};

App.defaultProps = {
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  resetActiveProtocol: bindActionCreators(protocolActions.resetProtocol, dispatch),
});

export { App };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
