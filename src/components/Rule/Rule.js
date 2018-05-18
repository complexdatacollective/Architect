import React from 'react';
import PropTypes from 'prop-types';
import AlterRule from './AlterRule';
import EgoRule from './EgoRule';
import EdgeRule from './EdgeRule';

const Rule = ({ type, ...otherProps }) => {
  const props = { type, ...otherProps };
  switch (type) {
    case 'alter':
      return <AlterRule {...props} />;
    case 'ego':
      return <EgoRule {...props} />;
    case 'edge':
      return <EdgeRule {...props} />;
    default:
      return null;
  }
};

Rule.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Rule;
