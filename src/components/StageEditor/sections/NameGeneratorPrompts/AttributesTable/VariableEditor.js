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

const getInput = (name, variableMeta) => {
  if (!name) { return null; }

  const inputType = VARIABLE_INPUT_TYPES[variableMeta.type] || VARIABLE_INPUT_TYPES.text;
  const inputComponent = fields[inputType];
  const options = variableMeta.options || null;

  return (
    <Field
      name={name}
      label={variableMeta.label}
      component={inputComponent}
      options={options}
    />
  );
};

const VariableEditor = ({ name, variableMeta, show }) => (
  <div className={cx('attributes-table-editor', { 'attributes-table-editor--show': show })}>
    {getInput(name, variableMeta)}
  </div>
);

VariableEditor.propTypes = {
  variableMeta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  show: PropTypes.bool,
};

VariableEditor.defaultProps = {
  show: false,
};

export default VariableEditor;
