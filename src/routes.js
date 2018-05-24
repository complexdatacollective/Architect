import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { nth, find, get } from 'lodash';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Protocol, Start } from './components/Routes';
import { getCSSVariableAsNumber } from './utils/CSSVariables';
import tween from './behaviours/Tweened/tween';

const getProtocolPath = pathname =>
  decodeURIComponent(nth(/^\/edit\/([^/]+)$/.exec(pathname), 1));

const getProtocolId = (protocols, path) => {
  const idFromArchivePath = get(find(protocols, ['archivePath', path]), 'id');
  const idFromWorkingPath = get(find(protocols, ['workingPath', path]), 'id');
  return idFromArchivePath || idFromWorkingPath || null;
};

const getProtocolIdFromPathname = (protocols, pathname) =>
  getProtocolId(protocols, getProtocolPath(pathname));

const dispatchRouteAnimations = ({ pathname }, history, protocols) => {
  const { pathname: previousPathname } = nth(history.entries, -2);

  switch (true) {
    case /^\/edit\/[^/]+$/.test(previousPathname) && /^\/$/.test(pathname): {
      tween({ name: 'protocol', from: 'overview-panel', to: getProtocolIdFromPathname(protocols, previousPathname) });
      break;
    }
    case /^\/$/.test(previousPathname) && /^\/edit\/[^/]+$/.test(pathname): {
      tween({ name: 'protocol', from: getProtocolIdFromPathname(protocols, pathname), to: 'overview-panel' });
      break;
    }
    default:
  }
};

class Routes extends Component {
  componentDidMount() {
    const { history } = this.props;

    history.listen(
      (event) => {
        dispatchRouteAnimations(event, this.props.history, this.props.protocols);
      },
    );
  }

  render() {
    const { location } = this.props;
    return (
      <TransitionGroup component={null}>
        <CSSTransition appear timeout={getCSSVariableAsNumber('--animation-duration-standard-ms')} classNames="route" key={location.key}>
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
  }
}

Routes.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  protocols: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  protocols: state.protocols,
});

export { Routes };

export default connect(
  mapStateToProps,
)(
  Routes,
);
