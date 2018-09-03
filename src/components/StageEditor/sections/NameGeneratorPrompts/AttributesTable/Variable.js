import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { map } from 'lodash';
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

const VariableChooser = ({ variableRegistry, onChooseVariable, show }) => (
  <div className={cx('variable__chooser', { 'variable__chooser--show': show })}>
    { map(variableRegistry, (variable, variableId) => (
      <div onClick={(e) => { e.stopPropagation(); onChooseVariable(variableId); }} >
        {variable.name}
      </div>
    )) }
  </div>
);

const VariablePreview = ({ variable, value, onDelete }) => (
  <div className="variable__preview">
    <div className="variable__preview-name">{variable}</div>
    <div className="variable__preview-value">{value}</div>
    <div className="variable__preview-control" onClick={onDelete}>x</div>
  </div>
);

const VariableEditor = ({ variable, variableMeta, show }) => (
  <div className={cx('variable__editor', { 'variable__editor--show': show })}>
    {getInput(variable, variableMeta)}
  </div>
);

const Variable = ({
  variable,
  variableMeta,
  value,
  isEditing,
  onToggleEdit,
  onDelete,
  onChooseVariable,
  variableRegistry,
}) => {
  const isNew = !variable;

  const variableClasses = cx(
    'variable',
    { 'variable--edit': isEditing },
    { 'variable--new': isNew },
  );

  return (
    <div className={variableClasses} onClick={onToggleEdit}>
      { !isNew && <VariablePreview variable={variable} value={value} onDelete={onDelete} /> }
      <div className="variable__edit">
        <VariableChooser show={isNew} onChooseVariable={onChooseVariable} variableRegistry={variableRegistry} />
        <VariableEditor show={!isNew} variable={variable} variableMeta={variableMeta} />
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
