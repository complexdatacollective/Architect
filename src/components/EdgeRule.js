/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import RuleDragHandle from './RuleDragHandle';

const EdgeRule = (
  ({ id, edgeTypes, onChangeOption, options: { type } }) => (
    <div className="rule">
      <RuleDragHandle /> Edge
      <label>
        Type:
        <select defaultValue={type} onChange={event => onChangeOption(event, id, 'type')} >
          {edgeTypes.map(
            (typeOption, index) => (
              <option key={index} value={typeOption}>{typeOption}</option>
            ),
          )}
        </select>
      </label>
    </div>
  )
);

EdgeRule.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChangeOption: PropTypes.func,
  options: PropTypes.shape({
    type: PropTypes.string,
  }),
  edgeTypes: PropTypes.array,
};

EdgeRule.defaultProps = {
  options: {
    type: null,
  },
  edgeTypes: [],
  onChangeOption: () => {},
};

export default SortableElement(EdgeRule);
