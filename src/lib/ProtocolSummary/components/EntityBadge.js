import React, { useContext } from 'react';
import { get } from 'lodash';
import cx from 'classnames';
import EntityIcon from '@components/Codebook/EntityIcon';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';

const EntityBadge = ({
  type,
  entity,
  link,
  small,
  tiny
}) => {
  const {
    protocol: { codebook },
  } = useContext(SummaryContext);

  const classes = cx(
    'protocol-summary-entity-badge',
    {
      'protocol-summary-entity-badge--small': small,
      'protocol-summary-entity-badge--tiny': tiny,
    },
  );

  const color = get(codebook, [entity, type, 'color']);
  const label = get(codebook, [entity, type, 'name']);

  const badge = (
    <>
      <div className="protocol-summary-entity-badge__icon">
        <EntityIcon color={color} entity={entity} />
      </div>
      <div className="protocol-summary-entity-badge__label">
        {label}
      </div>
    </>
  );

  if (!link) {
    return (
      <div className={classes}>
        {badge}
      </div>
    );
  }

  return (
    <DualLink
      to={`#entity-${type}`}
      className={classes}
    >
      {badge}
    </DualLink>
  );
};

export default EntityBadge;
