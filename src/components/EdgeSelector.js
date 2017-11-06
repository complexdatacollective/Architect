/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import SelectorDragHandle from './SelectorDragHandle';

const edgeTypes = [
  'friend',
  'family',
];

const EdgeSelector = (
  ({ id, onChangeOption, options: { type } }) => (
    <div className="selector">
      <SelectorDragHandle /> Edge
      <form>
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
      </form>
    </div>
  )
);

EdgeSelector.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChangeOption: PropTypes.func,
  options: PropTypes.shape({
    type: PropTypes.string,
  }),
};

EdgeSelector.defaultProps = {
  options: {
    type: null,
  },
  onChangeOption: () => {},
};

export default SortableElement(EdgeSelector);
