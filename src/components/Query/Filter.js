import React from 'react';
import PropTypes from 'prop-types';
import Rules from './Rules';

const Filter = ({ rules, join, codebook, onChange, openDialog }) => (
  <Rules
    rules={rules}
    join={join}
    onChange={onChange}
    openDialog={openDialog}
    codebook={codebook}
  />
);

Filter.propTypes = {
  onChange: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  rules: PropTypes.array.isRequired,
  codebook: PropTypes.object.isRequired,
  join: PropTypes.string.isRequired,
};

export { Filter };

export default Filter;
