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

const EdgeRule = (
  ({
    id,
    edgeTypes,
    edgeAttributes,
    onUpdateRule,
    onDeleteRule,
    options: { type, operator, attribute, value },
  }) => (
    <div className="rule rule--edge">
      <RuleDragHandle />
      <div className="rule__options">
        <div className="rule__option rule__option--type">
          <RuleDropDown
            options={edgeTypes}
            value={type}
            placeholder="{type}"
            onChange={event => onUpdateRule(event, id, 'type')}
          />
        </div>
        <div className="rule__option rule__option--attribute">
          <RuleDropDown
            options={has(edgeAttributes, type) ? edgeAttributes[type] : []}
            value={attribute}
            placeholder="{variable}"
            onChange={event => onUpdateRule(event, id, 'attribute')}
          />
        </div>
        <div className="rule__option rule__option--operator">
          <RuleDropDown
            options={operators}
            value={operator}
            placeholder="{rule}"
            onChange={event => onUpdateRule(event, id, 'operator')}
          />
        </div>
        <div className="rule__option rule__option--value">
          <RuleInput
            value={value}
            onChange={event => onUpdateRule(event, id, 'value')}
          />
        </div>
      </div>
      <div className="rule__delete" onClick={() => onDeleteRule(id)} />
    </div>
  )
);

EdgeRule.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onUpdateRule: PropTypes.func,
  onDeleteRule: PropTypes.func,
  options: PropTypes.shape({
    type: PropTypes.string,
    operator: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.string,
  }),
  edgeTypes: PropTypes.array,
  edgeAttributes: PropTypes.array,
};

EdgeRule.defaultProps = {
  options: {
    type: '',
    operator: '',
    attribute: '',
    value: '',
  },
  edgeTypes: [],
  edgeAttributes: [],
  onUpdateRule: () => {},
  onDeleteRule: () => {},
};

export default SortableElement(EdgeRule);
