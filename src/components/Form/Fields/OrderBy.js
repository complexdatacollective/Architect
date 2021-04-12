import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import {
  SortableElement, SortableHandle, SortableContainer, arrayMove,
} from 'react-sortable-hoc';
import { map, isArray, toPairs } from 'lodash';
import { Button, Icon } from '@codaco/ui';
import NativeSelect from './NativeSelect';

const NON_SORTABLE_TYPES = ['layout'];
const ASC = 'asc';
const DESC = 'desc';
const DIRECTIONS = [
  [ASC, 'Ascending'],
  [DESC, 'Descending'],
];

const RuleHandle = compose(
  SortableHandle,
)(
  () => (
    <div className="form-fields-order-by__handle">
      <Icon name="move" />
    </div>
  ),
);

const RuleDelete = (props) => (
  <div
    className="form-fields-order-by__delete"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <Icon name="delete" />
  </div>
);

const Rule = compose(
  SortableElement,
)(
  ({
    variables,
    disabledVariables,
    rule: { property, direction },
    sortIndex: index,
    handleChange,
    handleDelete,
  }) => (
    <div className="form-fields-order-by__rule">
      <div className="form-fields-order-by__rule-control">
        <RuleHandle />
      </div>
      <div className="form-fields-order-by__rule-options">
        <div className="form-fields-order-by__rule-option">
          <NativeSelect
            input={{
              onChange: (value) => handleChange(index, { property: value }),
              value: property,
            }}
            placeholder="Select a property"
            options={variables.map(({ label, value }) => (
              {
                value,
                disabled: disabledVariables.includes(value),
                label,
              }
            ))}
          />
        </div>
        <div className="form-fields-order-by__rule-option">
          <NativeSelect
            input={{
              onChange: (value) => handleChange(index, { direction: value }),
              value: direction,
            }}
            placeholder="Select a direction"
            options={DIRECTIONS.map(([value, label]) => (
              { value, label }
            ))}
          />
        </div>
      </div>
      <div className="form-fields-order-by__rule-control">
        <RuleDelete onClick={() => handleDelete(index)} />
      </div>
    </div>
  ),
);

const Rules = compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
  }),
  SortableContainer,
)(
  ({
    variables, rules, handleChange, handleDelete,
  }) => (
    <div className="form-fields-order-by">
      <div className="form-fields-order-by__rules">
        {
          rules.map((rule, index) => (
            <Rule
              variables={variables}
              disabledVariables={map(rules, 'property')}
              handleChange={handleChange}
              handleDelete={handleDelete}
              index={index}
              key={index} // eslint-disable-line react/no-array-index-key
              rule={rule}
              sortIndex={index}
            />
          ))
        }
      </div>
    </div>
  ),
);

class OrderBy extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { input } = this.props;

    const updatedRules = arrayMove(this.value, oldIndex, newIndex);
    input.onChange(updatedRules);
  }

  get value() {
    const { input } = this.props;
    return isArray(input.value) ? input.value : [];
  }

  get sortableVariableNames() {
    const { variables } = this.props;
    return toPairs(variables).filter(
      ([, { type }]) => !NON_SORTABLE_TYPES.includes(type),
    ).map(
      ([id, { name }]) => ({ label: name, value: id }),
    );
  }

  get variables() {
    return [{ label: '*', value: '*' }, ...this.sortableVariableNames];
  }

  get areRulesFull() {
    return this.value.length >= this.variables.length;
  }

  handleChange = (index, updatedRule) => {
    const { input } = this.props;
    const updatedRules = this.value.map(
      (rule, i) => {
        if (i !== index) { return rule; }
        return { ...rule, ...updatedRule };
      },
    );
    input.onChange(updatedRules);
  }

  handleAddNewRule = () => {
    const { input } = this.props;
    const updatedRules = [
      ...this.value,
      { property: '', direction: '' },
    ];
    input.onChange(updatedRules);
  };

  handleDelete = (index) => {
    const { input } = this.props;
    const updatedRules = this.value.filter(
      (rule, i) => i !== index,
    );
    input.onChange(updatedRules);
  };

  render() {
    const { label } = this.props;
    if (this.variables.length === 0) { return null; }

    return (
      <div className="form-fields-order-by">
        { label
          && <div className="form-fields-order-by__label">{label}</div>}
        <Rules
          rules={this.value}
          variables={this.variables}
          handleChange={this.handleChange}
          handleDelete={this.handleDelete}
          onSortEnd={this.onSortEnd}
        />
        { !this.areRulesFull
          && (
          <Button
            onClick={this.handleAddNewRule}
            content="Add Rule"
            color="primary"
            icon="add"
            size="small"
          />
          )}
      </div>
    );
  }
}

OrderBy.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    onChange: PropTypes.func,
  }),
  label: PropTypes.string,
};

OrderBy.defaultProps = {
  variables: {},
  input: {
    value: [],
    onChange: () => {},
  },
  label: '',
};

export default OrderBy;
