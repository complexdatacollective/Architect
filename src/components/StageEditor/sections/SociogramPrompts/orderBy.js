/* eslint-disable */
import React, { Component } from 'react';
import { compose, defaultProps } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer,  arrayMove } from 'react-sortable-hoc';
import { map, difference } from 'lodash';
import * as Fields from '../../../Form/Fields';

const ASC = 'asc';
const DESC = 'desc';
const DIRECTIONS = [ASC, DESC];

const RuleHandle = compose(
  SortableHandle,
)(
  () => (<div>[::]</div>)
);

const Rule = compose(
  SortableElement
)(
  ({
    variables,
    disabledVariables,
    rule: { variable, direction },
    sortIndex: index,
    handleChange,
    handleDelete,
  }) => (
    <div>
      <RuleHandle />
      <Fields.Select
        input={{
          onChange: (event) =>
            handleChange(index, { variable: event.target.value }),
          value: variable,
        }}
      >
        <option />
        {
          variables.map((value) => (
            <option
              key={value}
              disabled={disabledVariables.includes(value)}
            >{value}</option>
          ))
        }
      </Fields.Select>
      <Fields.Select
        input={{
          onChange: (event) =>
            handleChange(index, { direction: event.target.value }),
          value: direction,
        }}
      >
        <option />
        {
          DIRECTIONS.map((value) => (
            <option key={value}>{value}</option>
          ))
        }
      </Fields.Select>
      <button type="button" onClick={() => handleDelete(index)}>X</button>
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
    <div>
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
  )
);

const variables = [
  'age',
  'name',
  'favourite_color',
];

class OrderBy extends Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      input: {
        value: [
          { variable: 'age', direction: ASC },
          { variable: 'name', direction: DESC }
        ],
      },
    };
  }

  handleChange = (index, newValue) => {
    this.setState({
      input: {
        value: this.state.input.value.map(
          (rule, i) => {
            if (i !== index) { return rule; }
            return { ...rule, ...newValue };
          }
        ),
      },
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      input: {
        ...this.state.input.value,
        value: arrayMove(this.state.input.value, oldIndex, newIndex),
      },
    });
  }

  handleAddNewRule = () => {
    this.setState({
      input: {
        value: [
          ...this.state.input.value,
          { variable: '', direction: '' },
        ],
      },
    })
  };

  handleDelete = (index) => {
    this.setState({
      input: {
        value: this.state.input.value.filter(
          (rule, i) => i !== index
        ),
      },
    });
  };

  render() {
    return (
      <div>
        <Rules
          rules={this.state.input.value}
          variables={variables}
          handleChange={this.handleChange}
          handleDelete={this.handleDelete}
          onSortEnd={this.onSortEnd}
        />
        <button type="button" onClick={this.handleAddNewRule}>Add</button>
      </div>
    );
  };
};

export default OrderBy;
