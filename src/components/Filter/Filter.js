import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { get } from 'lodash';
import Rules from '../Rules';
import { getProtocol } from '../../selectors/protocol';

class Filter extends Component {
  handleRuleChange = (rules) => {
    this.props.onChange({
      rules,
      join: this.props.join,
    });
  }

  render() {
    const { rules, join, variableRegistry } = this.props;

    return (
      <div>
        <Rules
          rules={rules}
          join={join}
          onChange={this.handleRuleChange}
          variableRegistry={variableRegistry}
        />
      </div>
    );
  }
}

const connectToField = mapProps(
  props => ({
    rules: get(props.input.value, 'rules', []),
    join: get(props.input.value, 'join'),
    onChange: props.input.onChange,
  }),
);

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    variableRegistry: protocol.variableRegistry,
  };
}

export { Filter };

export default compose(
  connectToField,
  connect(mapStateToProps),
)(Filter);
