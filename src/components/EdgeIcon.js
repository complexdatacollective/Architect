import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../ui/components';

const EdgeIcon = ({ color }) => (
  <div
    className="edge-icon"
    style={{
      backgroundColor: color,
    }}
  >
    <Icon name="links" />
  </div>
);

EdgeIcon.propTypes = {
  color: PropTypes.string,
};

EdgeIcon.defaultProps = {
  color: 'initial',
};

export default EdgeIcon;
