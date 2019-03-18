import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import * as fields from '../../ui/components/Fields';
import Field from '../DetachedField';

const VARIABLE_INPUT_TYPES = {
  text: 'Text',
  number: 'Number',
  datetime: 'Text',
  boolean: 'Toggle',
  ordinal: 'RadioGroup',
  categorical: 'CheckboxGroup',
};

const getInput = (type) => {
  if (!type) { return null; }

  const inputType = VARIABLE_INPUT_TYPES[type] || VARIABLE_INPUT_TYPES.text;
  const InputComponent = fields[inputType];

  return InputComponent;
};

class VariableEditor extends Component {
  handleChange = (e, value) => {
    this.props.onChange(value);
  }

  renderInput() {
    const { type, validation, value, name, options } = this.props;

    const InputComponent = getInput(type);

    if (!InputComponent) { return null; }

    return (
      <Field
        component={InputComponent}
        onChange={this.handleChange}
        validation={validation}
        value={value}
        name={name}
        options={options}
      />
    );
  }

  render() {
    const { show } = this.props;

    return (
      <div className={cx('attributes-table-editor', { 'attributes-table-editor--show': show })}>
        {this.renderInput()}
      </div>
    );
  }
}

VariableEditor.propTypes = {
  value: PropTypes.any,
  show: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  validation: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

VariableEditor.defaultProps = {
  variable: null,
  show: false,
  value: undefined,
  type: null,
  name: '',
  options: [],
  validation: {},
};

export default VariableEditor;
