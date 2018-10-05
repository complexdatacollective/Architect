import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field } from 'redux-form';
import * as fields from '../../../../../ui/components/Fields';

const VARIABLE_INPUT_TYPES = {
  text: 'Text',
  number: 'Text', // TODO: numeric only!
  datetime: 'Text',
  boolean: 'Toggle',
  ordinal: 'RadioGroup',
  categorical: 'CheckboxGroup',
};

const getInput = (name, label, type, options) => {
  if (!name || !type) { return null; }

  const inputType = VARIABLE_INPUT_TYPES[type] || VARIABLE_INPUT_TYPES.text;
  const inputComponent = fields[inputType];

  return (
    <Field
      name={name}
      label={label}
      component={inputComponent}
      options={options}
    />
  );
};

const VariableEditor = ({ name, type, label, options, show }) => (
  <div className={cx('attributes-table-editor', { 'attributes-table-editor--show': show })}>
    {getInput(name, label, type, options)}
  </div>
);

VariableEditor.propTypes = {
  name: PropTypes.string,
  show: PropTypes.bool,
  type: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
};

VariableEditor.defaultProps = {
  show: false,
  name: null,
  type: null,
  label: '',
  options: [],
};

export default VariableEditor;
