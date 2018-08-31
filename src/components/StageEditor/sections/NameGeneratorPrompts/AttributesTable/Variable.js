import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import * as fields from '../../../../../ui/components/Fields';
import { Field } from 'redux-form';
import { getProtocol } from '../../../../../selectors/protocol';

const VARIABLE_INPUT_TYPES = {
  text: 'TextInput',
  number: 'TextInput',
  datetime: 'TextInput',
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

const VariableChooser = ({ variableRegistry }) => (
  <div>

  </div>
);

const VariablePreview = ({ variable, value, onDelete }) => (
  <div className="variable__preview">
    <div className="variable__preview-name">{variable}</div>
    <div className="variable__preview-value">{value}</div>
    <div className="variable__preview-control" onClick={onDelete}>x</div>
  </div>
);

const VariableEditor = ({ variable, variableMeta }) =>
  getInput(variable, variableMeta);

const Variable = ({
  variable,
  variableMeta,
  value,
  isEditing,
  onToggleEdit,
  onDelete,
  variableRegistry,
}) => {
  const isNew = variable === '_new';

  const variableClasses = cx(
    'variable',
    { 'variable--edit': isEditing },
    { 'variable--new': isNew },
  );

  return (
    <div className={variableClasses} onClick={onToggleEdit}>
      { !isNew && <VariablePreview variable={variable} value={value} onDelete={onDelete} /> }
      <div className="variable__editor">
        { isNew && <VariableChooser variableRegistry={variableRegistry} /> }
        { !isNew && <VariableEditor variable={variable} variableMeta={variableMeta} /> }
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  variableMeta: props.variableRegistry[props.variable],
});

export { Variable };

export default connect(
  mapStateToProps,
)(Variable);
