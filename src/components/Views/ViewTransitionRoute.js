/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const CSSTransitionRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}>
    {props => (
      <CSSTransition
        in={!!props.match}
        unmountOnExit
        mountOnEnter
        timeout={getCSSVariableAsNumber('--animation-duration-standard-ms')}
        classNames="route"
      >
        <Component {...props} />
      </CSSTransition>
    )}
  </Route>
);

CSSTransitionRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default CSSTransitionRoute;
