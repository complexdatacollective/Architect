import React from 'react';
import PropTypes from 'prop-types';
import Variables from './Variables';

const Entity = ({
  isNode,
  isEgo,
  isEdge,
  color,
  iconVariant,
  name,
  variables,
}) => (
  <div>
    {!isEgo && (
      <div>
        <div>
          {isEdge}
          {isNode}
          {iconVariant}
          {color}
        </div>
        <div>{name}</div>
      </div>
    )}

    {isEgo && (
      <div>
        Ego
      </div>
    )}

    {iconVariant}

    <Variables variables={variables} />
  </div>
);

Entity.propTypes = {
  isNode: PropTypes.bool,
  isEgo: PropTypes.bool,
  isEdge: PropTypes.bool,
  color: PropTypes.string.isRequired,
  iconVariant: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

Entity.defaultProps = {
  isNode: false,
  isEdge: false,
  isEgo: false,
};

export default Entity;
