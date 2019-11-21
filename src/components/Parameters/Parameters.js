import React from 'react';
import Scalar from './Scalar';

const getComponent = (type) => {
  switch (type) {
    case 'scalar':
      return Scalar;
    default:
      return null;
  }
};

const Parameters = ({ type, ...rest }) => {
  const ParameterComponent = getComponent(type);

  if (!ParameterComponent) { return null; }

  return <ParameterComponent {...rest} />;
};

export default Parameters;
