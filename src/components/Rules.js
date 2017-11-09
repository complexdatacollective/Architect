import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import Rule from './Rule';

const Rules = SortableContainer(
  ({ rules, onChangeOption, onDeleteRule }) => (
    <div className="rules">
      {rules.map((rule, index) => (
        <Rule
          {...rule}
          key={`rule-${rule.id}`}
          index={index}
          sortIndex={index}
          onChangeOption={onChangeOption}
          onDeleteRule={onDeleteRule}
        />
      ))}
    </div>
  ),
);

export default Rules;
