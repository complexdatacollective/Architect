import React from 'react';
import PropTypes from 'prop-types';
import MiniTable from '../MiniTable';
import { renderValue } from '../helpers';

const Behaviours = ({ behaviours }) => {
  if (!behaviours) { return null; }

  return (
    <div className="protocol-summary-stage__behaviours">
      <h2>Behaviours</h2>

      <div className="protocol-summary-stage__behaviours-content">
        <MiniTable
          rows={[
            [
              <strong>Repositioning enabled</strong>,
              renderValue(behaviours.allowRepositioning),
            ],
            [
              <strong>Freedraw enabled</strong>,
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
