/* eslint-disable */

import React, { Component } from 'react';
import { toPairs, get } from 'lodash';
import propTypes from 'prop-types';
import SeamlessTextInput from './SeamlessTextInput';
import Button from './Button';
import Modal from '../Modal';

class VariableChooser extends Component {
  static propTypes = {
    values: propTypes.object,
    variables: propTypes.object,
  };

  static defaultProps = {
    values: {},
    variables: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: null,
    };
  }

  editVariable = (variable) => {
    this.setState({ editing: variable });
  };

  onChangeVariable = (name, value) => {
    this.props.onChange({ ...this.props.values, [name]: value })
  }

  render() {
    const { values, variables } = this.props;

    return (
      <div>
        <div>{ toPairs(values).map(([name, value]) => (<div key={name}>{name}: {value}</div>)) }</div>
        <div>
          { toPairs(variables).map(([name]) => (
            <div key={name} onClick={() => this.editVariable(name)}>{name}</div>
          )) }
        </div>
        <Modal show={!!this.state.editing}>
          {this.state.editing}<br />
          <SeamlessTextInput
            onChange={(newValue) => this.onChangeVariable(this.state.editing, newValue)}
            value={get(values, this.state.editing)}
          />
          <Button onClick={() => this.setState({ editing: null })}>Done</Button>
        </Modal>
      </div>
    );
  }
}

export { VariableChooser };

export default VariableChooser;
