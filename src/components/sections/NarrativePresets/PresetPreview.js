import React from 'react';
import PropTypes from 'prop-types';

const PresetPreview = ({ label }) => (
  <div>
    {label}
  </div>
);

PresetPreview.propTypes = {
  label: PropTypes.string.isRequired,
};

export default PresetPreview;
