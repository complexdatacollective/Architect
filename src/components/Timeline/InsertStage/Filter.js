import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';

const Filter = ({
  query,
  order,
  handleChange,
}) => (
  <div className="timeline-insert-stage-filter">
    <div className="timeline-insert-stage-filter__option">
      <h4>Filter:</h4>
      <Fields.Text
        placeholder="Interface name..."
        input={{
          value: query,
          onChange: event => handleChange({ query: event.target.value }),
        }}
      />
    </div>
    <div className="timeline-insert-stage-filter__option">
      <h4>Sort by:</h4>
      <Select
        input={{
          value: order,
          name: 'sort_by',
          onChange: event => handleChange({ order: event }),
        }}
        options={[
          { label: 'A-Z', value: 'A-Z' },
          { label: 'Z-A', value: 'Z-A' },
        ]}
      />
    </div>
    <div className="timeline-insert-stage-filter__option timeline-insert-stage-filter__option--last">
      <div
        className="timeline-insert-stage-filter__reset"
        onClick={() => handleChange({ order: 'A-Z', query: '' })}
      >Reset</div>
    </div>
  </div>
);

Filter.propTypes = {
  query: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Filter;
