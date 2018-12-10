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
    this.onChange(value);
  }

  renderInput() {
    const { type, validation, variable, value, label, options } = this.props;

    const InputComponent = getInput(type);

    if (!InputComponent) { return null; }

    return (
      <Field
        component={InputComponent}
        name={variable}
        onChange={this.handleChange}
        validation={validation}
        value={value}
        label={label}
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
  onChange: PropTypes.func.isRequired,
  variable: PropTypes.string,
  show: PropTypes.bool,
  type: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  validation: PropTypes.object,
};

VariableEditor.defaultProps = {
  variable: null,
  show: false,
  value: undefined,
  type: null,
  label: '',
  options: [],
  validation: {},
};

export default VariableEditor;
