/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Rules from '../Rules';

const Filter = ({ filter }) => {
  if (!filter) { return null; }

  return (
    <div className="protocol-summary-stage__filter">
      <Rules filter={filter} />
    </div>
  );
};

Filter.propTypes = {
  filter: PropTypes.object.isRequired,
};

export default Filter;
