/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { toPairs, has } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import SelectorDragHandle from './SelectorDragHandle';
import SelectorDropDown from './SelectorDropDown';
import SelectorInput from './SelectorInput';

const operators = toPairs({
  EXACTLY: 'is Exactly',
  EXISTS: 'Exists',
  NOT: 'is Not',
  GREATER_THAN: 'is Greater Than',
  GREATER_THAN_OR_EQUAL: 'is Greater Than or Exactly',
  LESS_THAN: 'is Less Than',
  LESS_THAN_OR_EQUAL: 'is Less Than or Exactly',
});

const AlterSelector = ({
  id,
  nodeTypes,
  nodeAttributes,
  onChangeOption,
  options: { type, operator, attribute, value },
}) => (
  <div className="selector">
    <SelectorDragHandle />
    <div className="selector__options">
      <div className="selector__option selector__option--target">
        <SelectorDropDown
          options={nodeTypes}
          value={type}
          placeholder="{node}"
          onChange={event => onChangeOption(event, id, 'type')}
        />
      </div>
      <div className="selector__option selector__option--attribute">
        <SelectorDropDown
          options={has(nodeAttributes, type) ? nodeAttributes[type] : []}
          value={attribute}
          placeholder="{variable}"
          onChange={event => onChangeOption(event, id, 'attribute')}
        />
      </div>
      <div className="selector__option selector__option--operator">
        <SelectorDropDown
          options={operators}
          value={operator}
          placeholder="{rule}"
          onChange={event => onChangeOption(event, id, 'operator')}
        />
      </div>
      <div className="selector__option selector__option--value">
        <SelectorInput
          value={value}
          onChange={event => onChangeOption(event, id, 'value')}
        />
      </div>
    </div>
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
    type: '',
    operator: '',
    attribute: '',
    value: '',
  },
  onChangeOption: () => {},
  nodeTypes: [],
  nodeAttributes: {},
};

export default SortableElement(AlterSelector);
