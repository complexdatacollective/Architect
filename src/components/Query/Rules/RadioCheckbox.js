import React, { Component } from 'react';
import { last } from 'lodash';
import { CheckboxGroup } from '@ui/components/Fields';

class RadioCheckbox extends Component {
  handleChange = (value) => {
    const flattenedValue = last(value);
    this.props.input.onChange([flattenedValue]);
  }

  render() {
    const input = {
      ...this.props.input,
      onChange: this.handleChange,
    };

    return (
      <CheckboxGroup {...this.props} input={input} />
    );
  }
}

export default RadioCheckbox;
