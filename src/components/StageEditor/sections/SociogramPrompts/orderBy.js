/* eslint-disable */
import React, { Component } from 'react';
import { compose, defaultProps } from 'recompose';
import { SortableElement, SortableHandle, SortableContainer,  arrayMove } from 'react-sortable-hoc';
import { flatten, toPairs } from 'lodash';
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
  ({ variables, rule: [ index, rule ], handleChange}) => {
    const [ variable, direction ] = flatten(toPairs(rule));

    return (
      <div>
        <RuleHandle />
        <Fields.Select
          input={{
            onChange: (event) =>
              handleChange(index, { [event.target.value]: direction }),
            value: variable,
          }}
        >
          {
            variables.map((value) => (
              <option key={value}>{value}</option>
            ))
          }
        </Fields.Select>
        <Fields.Select
          input={{
            onChange: (event) =>
              handleChange(index, { [variable]: event.target.value }),
            value: direction,
          }}
        >
          {
            DIRECTIONS.map((value) => (
              <option key={value}>{value}</option>
            ))
          }
        </Fields.Select>
      </div>
    );
  },
);

const Rules = compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
  }),
  SortableContainer,
)(
  ({ variables, rules, handleChange }) => (
    <div>
      {
        rules.map((rule, index) => (
          <Rule
            variables={variables}
            handleChange={handleChange}
            index={index}
            key={index}
            rule={[index, rule]}
          />
        ))
      }
    </div>
  )
);

const variables = [
  'made',
  'up',
  'list',
];

class OrderBy extends Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      input: {
        value: [
          { 'made': ASC },
          { 'up': DESC }
        ],
      },
    };
  }

  handleChange = (index, newValue) => {
    console.log(index, newValue);

    this.setState({
      input: {
        value: this.state.input.value.map(
          (rule, i) => {
            if (i !== index) { return rule; }
            return newValue;
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

  render() {
    return (
      <Rules
        rules={this.state.input.value}
        variables={variables}
        handleChange={this.handleChange}
        onSortEnd={this.onSortEnd}
      />
    );
  };
};

export default OrderBy;
