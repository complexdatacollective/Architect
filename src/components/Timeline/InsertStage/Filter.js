import React from 'react';
import PropTypes from 'prop-types';
import { Text, Select } from '../../Form/Fields';

const Filter = ({
  query,
  sortBy,
  handleChange,
}) => (
  <div className="timeline-insert-stage__filter">
    <div className="timeline-insert-stage__filter-option">
      <h4>Search:</h4>
      <Text
        input={{
          value: query,
          onChange: event => handleChange({ query: event.target.value }),
        }}
      />
    </div>
    <div className="timeline-insert-stage__filter-option">
      <h4>Sort by:</h4>
      <Select
        input={{
          value: sortBy,
          onChange: event => handleChange({ sortBy: event.target.value }),
        }}
      >
        <option>A-Z</option>
        <option>Z-A</option>
      </Select>
    </div>
  </div>
);

Filter.propTypes = {
  query: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Filter;
