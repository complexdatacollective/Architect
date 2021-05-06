import React from 'react';
import PropTypes from 'prop-types';
import EntityIcon from '@components/Codebook/EntityIcon';
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
  <div className="protocol-summary-entity">
    {!isEgo && (
      <div className="protocol-summary-entity__meta">
        <div>
          <EntityIcon color={color} entity={(isEdge ? 'edge' : 'node')} />
        </div>
        <div><h1>{name}</h1></div>
      </div>
    )}

    {isEgo && (
      <div className="protocol-summary-entity__meta">
        <h1>
          Ego
        </h1>
      </div>
    )}

    <div className="protocol-summary-entity__variables">
      <Variables variables={variables} />
    </div>
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
