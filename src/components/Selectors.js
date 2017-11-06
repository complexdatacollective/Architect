import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import Selector from './Selector';

const Selectors = SortableContainer(
  ({ selectors, onChangeOption }) => (
    <div className="selectors">
      {selectors.map((selector, index) => (
        <Selector {...selector} key={`selector-${selector.id}`} index={index} sortIndex={index} onChangeOption={onChangeOption} />
      ))}
    </div>
  ),
);

export default Selectors;
