import React from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import Scalar from './Scalar';
import DatePicker from './DatePicker';
import RelativeDatePicker from './RelativeDatePicker';

const definitions = [
  [Scalar, { type: 'scalar' }],
  [DatePicker, { type: 'datetime', component: 'DatePicker' }],
  [RelativeDatePicker, { type: 'datetime', component: 'RelativeDatePicker' }],
];

const getComponent = (options) => {
  const [component] = definitions.find(
    ([, pattern]) => isMatch(options, pattern),
  );

  return component;
};

const Parameters = ({ type, component, ...rest }) => {
  const ParameterComponent = getComponent({ type, component });
  if (!ParameterComponent) { return null; }

  return (
    <ParameterComponent
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
};

Parameters.propTypes = {
  type: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.any.isRequired,
};

export default Parameters;
