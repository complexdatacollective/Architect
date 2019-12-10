import React from 'react';
import PropTypes from 'prop-types';
import Scalar from './Scalar';
import DateTime from './DateTime';

const getComponent = (type) => {
  switch (type) {
    case 'scalar':
      return Scalar;
    case 'datetime':
      return DateTime;
    default:
      return null;
  }
};

const Parameters = ({ type, ...rest }) => {
  const ParameterComponent = getComponent(type);

  if (!ParameterComponent) { return null; }

  return <ParameterComponent {...rest} />;
};

Parameters.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Parameters;
