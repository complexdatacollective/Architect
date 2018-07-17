import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer, arrayMove } from 'react-sortable-hoc';
import { map, isArray, toPairs } from 'lodash';
import { Icon } from '../../../ui/components';
import Select from './Select';

const NON_SORTABLE_TYPES = ['layout'];
const ASC = 'asc';
const DESC = 'desc';
const DIRECTIONS = [
  [ASC, 'ascending'],
  [DESC, 'descending'],
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

const AddRule = props => (
  <div className="form-fields-order-by__add" {...props}>
    <Icon name="add" /> Add sorting rule
  </div>
);

const Rule = compose(
  SortableElement,
)(
  ({
    variables,
    disabledVariables,
    rule: { variable, direction },
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
              onChange: event =>
                handleChange(index, { variable: event.target.value }),
              value: variable,
            }}
          >
            <option value="" disabled>&mdash; select property &mdash;</option>
            {
              variables.map(value => (
                <option
                  key={value}
                  disabled={disabledVariables.includes(value)}
                >{value}</option>
              ))
            }
          </Select>
        </div>
        <div className="form-fields-order-by__rule-option">
          <Select
            input={{
              onChange: event =>
                handleChange(index, { direction: event.target.value }),
              value: direction,
            }}
          >
            <option value="" disabled>&mdash; select direction &mdash;</option>
            {
              DIRECTIONS.map(([value, label]) => (
                <option key={value}>{label}</option>
              ))
            }
          </Select>
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
              disabledVariables={map(rules, 'variable')}
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
      ([name]) => name,
    );
  }

  get variables() {
    return ['*', ...this.sortableVariableNames];
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
      { variable: '', direction: '' },
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
          <AddRule onClick={this.handleAddNewRule} />
        }
      </div>
    );
  }
}

export default OrderBy;
