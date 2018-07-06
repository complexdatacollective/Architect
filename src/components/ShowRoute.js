/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const ShowRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}>
    {props => <Component {...props} show={!!props.match} />}
  </Route>
);

ShowRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default ShowRoute;
