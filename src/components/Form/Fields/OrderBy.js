import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer, arrayMove } from 'react-sortable-hoc';
import { map } from 'lodash';
import { Icon } from '../../../ui/components';
import Select from './Select';

const ASC = 'asc';
const DESC = 'desc';
const DIRECTIONS = [ASC, DESC];

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
    <Icon name="add" />
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
            <option />
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
            <option />
            {
              DIRECTIONS.map(value => (
                <option key={value}>{value}</option>
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
  static defaultProps = {
    variables: [],
    input: {
      value: [],
      onChange: () => {},
    },
    label: '',
  };

  static propTypes = {
    variables: PropTypes.array,
    input: PropTypes.shape({
      value: PropTypes.array,
      onChange: PropTypes.func,
    }),
    label: PropTypes.string,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const updatedRules = arrayMove(this.value, oldIndex, newIndex);
    this.props.input.onChange(updatedRules);
  }

  get value() {
    return this.props.input.value || [];
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
    if (this.props.variables.length === 0) { return null; }

    return (
      <div className="form-fields-order-by">
        { this.props.label &&
          <div className="form-fields-order-by__label">{this.props.label}</div>
        }
        <Rules
          rules={this.value}
          variables={this.props.variables}
          handleChange={this.handleChange}
          handleDelete={this.handleDelete}
          onSortEnd={this.onSortEnd}
        />
        <AddRule onClick={this.handleAddNewRule} />
      </div>
    );
  }
}

export default OrderBy;
