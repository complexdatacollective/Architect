import React, { useContext } from 'react';
import PropTypes from 'prop-types';
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
  tiny,
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
  const name = get(codebook, [entity, type, 'name']);

  const label = (small || tiny)
    ? name
    : <h2>{name}</h2>;

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

EntityBadge.propTypes = {
  type: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  link: PropTypes.bool,
  small: PropTypes.bool,
  tiny: PropTypes.bool,
};

EntityBadge.defaultProps = {
  link: false,
  small: false,
  tiny: false,
};

export default EntityBadge;
