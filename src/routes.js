/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Protocol, Start } from './containers';
import { getCSSVariableAsNumber } from './utils/CSSVariables';
import tween from './behaviours/Tweened/tween';

const dispatchRouteAnimations = ({ pathname }) => {
  switch (true) {
    case /^\/$/.test(pathname):
      tween({ name: "foo", from: "overview-panel", to: "protocol-stack" });
      break;
    case /^\/edit\/[^\/]+$/.test(pathname):
      tween({ name: "foo", from: "protocol-stack", to: "overview-panel" });
      break;
  }
}

class Routes extends Component {
  componentDidMount() {
    this.props.history.listen(dispatchRouteAnimations);
  }

  render() {
    const { location } = this.props;
    return (
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
  }
}

// const routes = ({ location }) => (
//   <TransitionGroup component={null}>
//     <CSSTransition
// appear
// timeout={getCSSVariableAsNumber('--animation-duration-fast-ms')}
// classNames="route" key={location.key}>
//       <Switch location={location}>
//         <Route
//           exact
//           path="/edit/:protocol"
//           component={Protocol}
//         />
//         <Route
//           exact
//           path="/"
//           component={Start}
//         />
//         <Redirect to="/" />
//       </Switch>
//     </CSSTransition>
//   </TransitionGroup>
// );

Routes.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Routes;
