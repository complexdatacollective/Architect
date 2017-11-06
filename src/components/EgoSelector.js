/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
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

const EgoSelector = ({
  id,
  nodeAttributes,
  onChangeOption,
  options: { operator, attribute, value },
}) => (
  <div className="selector">
    <SelectorDragHandle />
    <label>
      Attribute:
      <select value={attribute} onChange={event => onChangeOption(event, id, 'attribute')}>
        <option value="">Please select</option>
        {nodeAttributes.map(
          (attributeOption, index) => (
            <option key={index} value={attributeOption}>{attributeOption}</option>
          ),
        )}
      </select>
    </label>
    <label>
      Operator:
      <select value={operator} onChange={event => onChangeOption(event, id, 'operator')}>
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
  </div>
);

EgoSelector.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChangeOption: PropTypes.func,
  options: PropTypes.shape({
    operator: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.string,
  }),
  nodeAttributes: PropTypes.array,
};

EgoSelector.defaultProps = {
  options: {
    operator: '',
    attribute: '',
    value: '',
  },
  onChangeOption: () => {},
  nodeAttributes: [],
};

export default SortableElement(EgoSelector);
