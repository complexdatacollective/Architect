import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nth } from 'lodash';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Protocol, Start } from './components/Routes';
import { getCSSVariableAsNumber } from './utils/CSSVariables';
import tween from './behaviours/Tweened/tween';

const getProtocolName = pathname =>
  decodeURIComponent(nth(/^\/edit\/([^/]+)$/.exec(pathname), 1));

const dispatchRouteAnimations = ({ pathname }, history) => {
  const { pathname: previousPathname } = nth(history.entries, -2);

  switch (true) {
    case /^\/edit\/[^/]+$/.test(previousPathname) && /^\/$/.test(pathname): {
      tween({ name: 'protocol', from: 'overview-panel', to: getProtocolName(previousPathname) });
      break;
    }
    case /^\/$/.test(previousPathname) && /^\/edit\/[^/]+$/.test(pathname): {
      tween({ name: 'protocol', from: getProtocolName(pathname), to: 'overview-panel' });
      break;
    }
    default:
  }
};

class Routes extends Component {
  componentDidMount() {
    this.props.history.listen(event => dispatchRouteAnimations(event, this.props.history));
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
};

export default Routes;
