import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import MiniTable from '../MiniTable';
import { renderValue } from '../helpers';

const behaviorLabel = (behaviourValue, behaviourKey) => {
  switch (behaviourKey) {
    case 'allowRepositioning':
      return { label: 'Repositioning enabled', value: behaviourValue };
    case 'automaticLayout':
      return { label: 'Automatic layout enabled', value: behaviourValue.enabled };
    case 'minNodes':
      return { label: 'Minimum nodes on stage', value: behaviourValue };
    case 'maxNodes':
      return { label: 'Maximum nodes on stage', value: behaviourValue };
    case 'freeDraw':
      return { label: 'Freedraw enabled', value: behaviourValue };
    default:
      return { label: behaviourKey, value: behaviourValue };
  }
};

const behaviourRows = (behaviours) => map(behaviours, (behaviourValue, behaviourKey) => {
  const labelValue = behaviorLabel(behaviourValue, behaviourKey);
  return [
    labelValue.label,
    renderValue(labelValue.value),
  ];
});

const Behaviours = ({ behaviours }) => {
  if (!behaviours) { return null; }

  return (
    <div className="protocol-summary-stage__behaviours">
      <div className="protocol-summary-stage__behaviours-content">
        <h2 className="section-heading">Behaviours</h2>
        <MiniTable
          rotated
          rows={behaviourRows(behaviours)}
        />
      </div>
    </div>
  );
};

Behaviours.propTypes = {
  behaviours: PropTypes.shape({
    allowRepositioning: PropTypes.bool,
    freeDraw: PropTypes.bool,
  }),
};

Behaviours.defaultProps = {
  behaviours: null,
};

export default Behaviours;
