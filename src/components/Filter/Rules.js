import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { TransitionGroup } from 'react-transition-group';
import Rule from './Rule';
import AppearTransition from '../Transitions/Appear';

const Rules = SortableContainer(
  ({ rules, onUpdateRule, onDeleteRule }) => (
    <TransitionGroup className="rules">
      {rules.map((rule, index) => (
        <AppearTransition
          key={`rule-${rule.id}`}
        >
          <Rule
            {...rule}
            index={index}
            sortIndex={index}
            onUpdateRule={onUpdateRule}
            onDeleteRule={onDeleteRule}
            className="rules__rule"
          />
        </AppearTransition>
      ))}
    </TransitionGroup>
  ),
);

export default Rules;
