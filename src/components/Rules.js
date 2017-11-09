import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import Rule from './Rule';

const Rules = SortableContainer(
  ({ rules, onUpdateRule, onDeleteRule }) => (
    <div className="rules">
      {rules.map((rule, index) => (
        <Rule
          {...rule}
          key={`rule-${rule.id}`}
          index={index}
          sortIndex={index}
          onUpdateRule={onUpdateRule}
          onDeleteRule={onDeleteRule}
        />
      ))}
    </div>
  ),
);

export default Rules;
