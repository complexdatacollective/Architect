import React from 'react';
import PropTypes from 'prop-types';

const Presets = ({ presets }) => {
  if (!presets) { return null; }

  return (
    <div className="protocol-summary-stage__presets">
      <h2>Presets</h2>
    </div>
  );
};

Presets.propTypes = {
};

Presets.defaultProps = {
};

export default Presets;
