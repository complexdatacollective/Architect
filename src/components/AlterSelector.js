/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { toPairs, has } from 'lodash';
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

const AlterSelector = ({
  id,
  nodeTypes,
  nodeAttributes,
  onChangeOption,
  options: { type, operator, attribute, value },
}) => (
  <div className="selector">
    <SelectorDragHandle />
    <form>
      <label>
        Type:
        <select defaultValue={type} onChange={event => onChangeOption(event, id, 'type')}>
          <option value="">Please select</option>
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
          <option value="">Please select</option>
          {has(nodeAttributes, type) && nodeAttributes[type].map(
            (attributeOption, index) => (
              <option key={index} value={value}>{attributeOption}</option>
            ),
          )}
        </select>
      </label>
      <label>
        Operator:
        <select defaultValue={operator} onChange={event => onChangeOption(event, id, 'operator')}>
          <option value="">Please select</option>
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
);

AlterSelector.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChangeOption: PropTypes.func,
  options: PropTypes.shape({
    type: PropTypes.string,
    operator: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.string,
  }),
  nodeTypes: PropTypes.array,
  nodeAttributes: PropTypes.object,
};

AlterSelector.defaultProps = {
  options: {
    type: null,
    operator: null,
    attribute: null,
    value: '',
  },
  onChangeOption: () => {},
  nodeTypes: [],
  nodeAttributes: {},
};

export default SortableElement(AlterSelector);
