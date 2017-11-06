/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import SelectorDragHandle from './SelectorDragHandle';

const edgeTypes = [
  'friend',
  'family',
];

const EdgeSelector = SortableElement((
  ({ select, id, onChangeOption, options: { type }, sortIndex }) => (
    <div className="selector">
      <SelectorDragHandle /> {sortIndex} {select}
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
));

export default EdgeSelector;
