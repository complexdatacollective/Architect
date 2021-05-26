import React from 'react';
import PropTypes from 'prop-types';
import MiniTable from '../MiniTable';
import { renderValue } from '../helpers';

const Behaviours = ({ behaviours }) => {
  if (!behaviours) { return null; }

  return (
    <div className="protocol-summary-stage__behaviours">
      <div className="protocol-summary-stage__behaviours-content">
        <h2 className="section-heading">Behaviours</h2>
        <MiniTable
          rotated
          rows={[
            [
              'Repositioning enabled',
              renderValue(behaviours.allowRepositioning),
            ],
            [
              'Freedraw enabled',
              renderValue(behaviours.freeDraw),
            ],
          ]}
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
