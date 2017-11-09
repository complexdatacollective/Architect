/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import RuleDragHandle from './RuleDragHandle';
import RuleDropDown from './RuleDropDown';

const EdgeRule = (
  ({
    id,
    edgeTypes,
    onUpdateRule,
    onDeleteRule,
    options: { type },
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
  }),
  edgeTypes: PropTypes.array,
};

EdgeRule.defaultProps = {
  options: {
    type: null,
  },
  edgeTypes: [],
  onUpdateRule: () => {},
  onDeleteRule: () => {},
};

export default SortableElement(EdgeRule);
