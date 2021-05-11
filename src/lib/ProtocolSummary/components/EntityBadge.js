import React, { useContext } from 'react';
import { get } from 'lodash';
import EntityIcon from '@components/Codebook/EntityIcon';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';

const EntityBadge = ({
  type,
  entity,
  showLink
}) => {
  const {
    protocol: { codebook },
  } = useContext(SummaryContext);

  const color = get(codebook, [entity, type, 'color']);
  const name = get(codebook, [entity, type, 'name']);

  const badge = (
    <>
      <div className="protocol-summary-entity-badge__icon">
        <EntityIcon color={color} entity={entity} />
      </div>
      <div className="protocol-summary-entity-badge__name">
        <h1>{name}</h1>
      </div>
    </>
  );

  if (!showLink) {
    return (
      <div className="protocol-summary-entity-badge">
        {badge}
      </div>
    );
  }

  return (
    <DualLink
      to={`#entity-${type}`}
      className="protocol-summary-entity-badge"
    >
      {badge}
    </DualLink>
  );
};

export default EntityBadge;
