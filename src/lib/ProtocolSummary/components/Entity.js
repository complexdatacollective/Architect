import React from 'react';
import PropTypes from 'prop-types';
import EntityIcon from '@components/Codebook/EntityIcon';
import Variables from './Variables';

const Entity = ({
  id,
  color,
  isEdge,
  isEgo,
  isNode,
  name,
  variables,
}) => (
  <div
    className="protocol-summary-entity"
    id={isEgo ? 'ego' : `entity-${id}`}
  >
    {!isEgo && (
      <div className="protocol-summary-entity__meta">
        <div className="protocol-summary-entity__meta-icon">
          <EntityIcon color={color} entity={(isEdge ? 'edge' : 'node')} />
        </div>
        <div className="protocol-summary-entity__meta-name">
          <h1>{name}</h1>
        </div>
      </div>
    )}

    {isEgo && (
      <div className="protocol-summary-entity__meta">
        <div className="protocol-summary-entity__meta-name">
          <h1>
            Ego
          </h1>
        </div>
      </div>
    )}

    <div className="protocol-summary-entity__variables">
      <Variables variables={variables} />
    </div>
  </div>
);

Entity.propTypes = {
  id: PropTypes.string,
  color: PropTypes.string,
  isEdge: PropTypes.bool,
  isEgo: PropTypes.bool,
  isNode: PropTypes.bool,
  name: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

Entity.defaultProps = {
  id: null,
  color: null,
  isEdge: false,
  isEgo: false,
  isNode: false,
  name: null,
};

export default Entity;
