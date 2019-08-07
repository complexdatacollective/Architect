import React, { Component } from 'react';
import { last } from 'lodash';
import { CheckboxGroup } from '@ui/components/Fields';

class RadioCheckbox extends Component {
  handleChange = (value) => {
    const serializedValue = last(value);
    this.props.input.onChange(serializedValue);
  }

  render() {
    const input = {
      ...this.props.input,
      value: this.props.input.value ? [this.props.input.value] : [],
      onChange: this.handleChange,
    };

    return (
      <CheckboxGroup {...this.props} input={input} />
    );
  }
}

export default RadioCheckbox;
