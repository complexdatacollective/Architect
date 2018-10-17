import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import * as fields from '../../../../../ui/components/Fields';

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
  handleChange = (eventOrValue) => {
    const { onChange, variable } = this.props;

    if (!eventOrValue.target) {
      onChange({ [variable]: eventOrValue });
      return;
    }

    const target = eventOrValue.target;
    const newValue = target.type === 'checkbox' ? target.checked : target.value;
    onChange({ [variable]: newValue });
  }

  render() {
    const { type, variable, value, label, options, show } = this.props;

    const InputComponent = getInput(type);

    return (
      <div className={cx('attributes-table-editor', { 'attributes-table-editor--show': show })}>
        { InputComponent &&
          <InputComponent
            label={label}
            input={{ value, onChange: this.handleChange, name: variable }}
            options={options}
          />
        }
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
};

VariableEditor.defaultProps = {
  variable: null,
  show: false,
  value: undefined,
  type: null,
  label: '',
  options: [],
};

export default VariableEditor;
