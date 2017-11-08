/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { toPairs, has } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import RuleDragHandle from './RuleDragHandle';
import RuleDropDown from './RuleDropDown';
import RuleInput from './RuleInput';

const operators = toPairs({
  EXACTLY: 'is Exactly',
  EXISTS: 'Exists',
  NOT: 'is Not',
  GREATER_THAN: 'is Greater Than',
  GREATER_THAN_OR_EQUAL: 'is Greater Than or Exactly',
  LESS_THAN: 'is Less Than',
  LESS_THAN_OR_EQUAL: 'is Less Than or Exactly',
});

const AlterRule = ({
  id,
  nodeTypes,
  nodeAttributes,
  onChangeOption,
  options: { type, operator, attribute, value },
}) => (
  <div className="rule">
    <RuleDragHandle />
    <div className="rule__options">
      <div className="rule__option rule__option--type">
        <RuleDropDown
          options={nodeTypes}
          value={type}
          placeholder="{node}"
          onChange={event => onChangeOption(event, id, 'type')}
        />
      </div>
      <div className="rule__option rule__option--attribute">
        <RuleDropDown
          options={has(nodeAttributes, type) ? nodeAttributes[type] : []}
          value={attribute}
          placeholder="{variable}"
          onChange={event => onChangeOption(event, id, 'attribute')}
        />
      </div>
      <div className="rule__option rule__option--operator">
        <RuleDropDown
          options={operators}
          value={operator}
          placeholder="{rule}"
          onChange={event => onChangeOption(event, id, 'operator')}
        />
      </div>
      <div className="rule__option rule__option--value">
        <RuleInput
          value={value}
          onChange={event => onChangeOption(event, id, 'value')}
        />
      </div>
    </div>
  </div>
);

AlterRule.propTypes = {
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

AlterRule.defaultProps = {
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

export default SortableElement(AlterRule);
