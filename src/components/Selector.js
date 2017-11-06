import React from 'react';
import PropTypes from 'prop-types';
import AlterSelector from './AlterSelector';
import EdgeSelector from './EdgeSelector';

const Selector = ({ select, ...otherProps }) => {
  const props = { select, ...otherProps };
  switch (select) {
    case 'alter':
      return <AlterSelector {...props} />;
    case 'edge':
      return <EdgeSelector {...props} />;
    default:
      return null;
  }
};

Selector.propTypes = {
  select: PropTypes.string.isRequired,
};

export default Selector;
