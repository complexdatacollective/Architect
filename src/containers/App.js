import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';

require('../styles/main.scss');

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
      <div className="app__logo" onClick={resetActiveProtocol} />
      { children }
    </div>

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

const mapDispatchToProps = dispatch => ({
  resetActiveProtocol: bindActionCreators(protocolActions.resetProtocol, dispatch),
});

export { App };

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(App);
