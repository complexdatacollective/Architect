/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import { toPairs } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import SelectorDragHandle from './SelectorDragHandle';

const operators = {
  GREATER_THAN: 'Greater than',
  GREATER_THAN_OR_EQUAL: 'Greater than or exactly',
  LESS_THAN: 'Less than',
  LESS_THAN_OR_EQUAL: 'Less than or exactly',
  EXACTLY: 'Exactly',
  NOT: 'Not',
  EXISTS: 'Exists',
};

const nodeTypes = [
  'person',
  'place',
];

const nodeAttributes = [
  'name',
  'nick',
];

const AlterSelector = SortableElement((
  ({ select, id, onChangeOption, options: { type, operator, attribute, value }, sortIndex }) => (
    <div className="selector">
      <SelectorDragHandle /> {sortIndex} {select}
      <form>
        <label>
          Type:
          <select defaultValue={type} onChange={event => onChangeOption(event, id, 'type')}>
            {nodeTypes.map(
              (typeOption, index) => (
                <option key={index} value={typeOption}>{typeOption}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Attribute:
          <select defaultValue={attribute} onChange={event => onChangeOption(event, id, 'attribute')}>
            {nodeAttributes.map(
              (attributeOption, index) => (
                <option key={index} value={value}>{attributeOption}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Operator:
          <select defaultValue={operator} onChange={event => onChangeOption(event, id, 'operator')}>
            {toPairs(operators).map(
              ([operatorOption, operatorLabel], index) => (
                <option key={index} value={operatorOption}>{operatorLabel}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Value:
          <input type="text" value={value} onChange={event => onChangeOption(event, id, 'value')} />
        </label>
      </form>
    </div>
  )
));

export default AlterSelector;
