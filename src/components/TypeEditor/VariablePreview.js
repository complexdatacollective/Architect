import React from 'react';
import PropTypes from 'prop-types';

const VariablePreview = ({ name }) => (
  <>
    {name}
  </>
);

VariablePreview.propTypes = {
  name: PropTypes.string.isRequired,
};

export default VariablePreview;
