import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const ShowRoute = ({ component: Component, path, ...rest }) => (
  <Route path={path}>
    {props => <Component {...props} {...rest} show={!!props.match} />}
  </Route>
);

ShowRoute.propTypes = {
  path: PropTypes.string.isRequired,
  match: PropTypes.any.isRequired, // TODO: hunt down react router dom docs
  component: PropTypes.func.isRequired,
};

export default ShowRoute;
