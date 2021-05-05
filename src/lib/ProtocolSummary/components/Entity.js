import React from 'react';
import PropTypes from 'prop-types';
import Variables from './Variables';

const Entity = ({
  color,
  iconVariant,
  isEdge,
  isEgo,
  isNode,
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

    <Variables variables={variables} />
  </div>
);

Entity.propTypes = {
  color: PropTypes.string,
  iconVariant: PropTypes.string,
  isEdge: PropTypes.bool,
  isEgo: PropTypes.bool,
  isNode: PropTypes.bool,
  name: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

Entity.defaultProps = {
  color: null,
  iconVariant: null,
  isEdge: false,
  isEgo: false,
  isNode: false,
  name: null,
};

export default Entity;
