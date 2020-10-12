import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer, arrayMove } from 'react-sortable-hoc';
import { map, isArray, toPairs } from 'lodash';
import { Button, Icon } from '@codaco/ui';
import Select from './Select';

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

const RuleDelete = props => (
  <div className="form-fields-order-by__delete" {...props}>
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
          <Select
            input={{
              onChange: value =>
                handleChange(index, { property: value }),
              value: property,
            }}
            placeholder="&mdash; select property &mdash;"
            options={variables.map(({ label, value }) => (
              {
                value,
                isDisabled: disabledVariables.includes(value),
                label,
              }
            ))}
          />
        </div>
        <div className="form-fields-order-by__rule-option">
          <Select
            input={{
              onChange: value =>
                handleChange(index, { direction: value }),
              value: direction,
            }}
            placeholder="&mdash; select direction &mdash;"
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
  ({ variables, rules, handleChange, handleDelete }) => (
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
              key={index}
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
  static propTypes = {
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

  static defaultProps = {
    variables: {},
    input: {
      value: [],
      onChange: () => {},
    },
    label: '',
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const updatedRules = arrayMove(this.value, oldIndex, newIndex);
    this.props.input.onChange(updatedRules);
  }

  get value() {
    return isArray(this.props.input.value) ? this.props.input.value : [];
  }

  get sortableVariableNames() {
    return toPairs(this.props.variables).filter(
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
    const updatedRules = this.value.map(
      (rule, i) => {
        if (i !== index) { return rule; }
        return { ...rule, ...updatedRule };
      },
    );
    this.props.input.onChange(updatedRules);
  }

  handleAddNewRule = () => {
    const updatedRules = [
      ...this.value,
      { property: '', direction: '' },
    ];
    this.props.input.onChange(updatedRules);
  };

  handleDelete = (index) => {
    const updatedRules = this.value.filter(
      (rule, i) => i !== index,
    );
    this.props.input.onChange(updatedRules);
  };

  render() {
    if (this.variables.length === 0) { return null; }

    return (
      <div className="form-fields-order-by">
        { this.props.label &&
          <div className="form-fields-order-by__label">{this.props.label}</div>
        }
        <Rules
          rules={this.value}
          variables={this.variables}
          handleChange={this.handleChange}
          handleDelete={this.handleDelete}
          onSortEnd={this.onSortEnd}
        />
        { !this.areRulesFull &&
          <Button
            onClick={this.handleAddNewRule}
            content="Add Rule"
            color="primary"
            icon="add"
            size="small"
          />
        }
      </div>
    );
  }
}

export default OrderBy;
