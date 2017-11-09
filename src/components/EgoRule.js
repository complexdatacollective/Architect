/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { toPairs } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import RuleDragHandle from './RuleDragHandle';
import RuleDropDown from './RuleDropDown';
import RuleInput from './RuleInput';

const operators = toPairs({
  GREATER_THAN: 'Greater than',
  GREATER_THAN_OR_EQUAL: 'Greater than or exactly',
  LESS_THAN: 'Less than',
  LESS_THAN_OR_EQUAL: 'Less than or exactly',
  EXACTLY: 'Exactly',
  NOT: 'Not',
  EXISTS: 'Exists',
});

const EgoRule = ({
  id,
  nodeAttributes,
  onUpdateRule,
  onDeleteRule,
  options: { operator, attribute, value },
}) => (
  <div className="rule rule--ego">
    <RuleDragHandle />
    <div className="rule__options">
      <div className="rule__option rule__option--attribute">
        <RuleDropDown
          options={nodeAttributes}
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
);

EgoRule.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onUpdateRule: PropTypes.func,
  onDeleteRule: PropTypes.func,
  options: PropTypes.shape({
    operator: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.string,
  }),
  nodeAttributes: PropTypes.array,
};

EgoRule.defaultProps = {
  options: {
    operator: '',
    attribute: '',
    value: '',
  },
  onUpdateRule: () => {},
  onDeleteRule: () => {},
  nodeAttributes: [],
};

export default SortableElement(EgoRule);
