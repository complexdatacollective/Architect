import React from 'react';
import PropTypes from 'prop-types';
import Variables from './Variables';
import EntityBadge from './EntityBadge';

const Entity = ({
  type,
  entity,
  variables,
}) => (
  <div
    className="protocol-summary-entity page-break-marker"
    id={entity === 'ego' ? 'ego' : `entity-${type}`}
  >
    {entity !== 'ego' && (
      <div className="protocol-summary-entity__meta">
        <EntityBadge type={type} entity={entity} />
      </div>
    )}

    {entity === 'ego' && (
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
  type: PropTypes.string,
  entity: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object,
};

Entity.defaultProps = {
  type: null,
  entity: null,
  variables: null,
};

export default Entity;
