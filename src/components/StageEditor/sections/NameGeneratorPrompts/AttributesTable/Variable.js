import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import VariablePreview from './VariablePreview';
import VariableChooser from './VariableChooser';
import VariableEditor from './VariableEditor';

class Variable extends Component {
  static propTypes = {
    unusedVariables: PropTypes.array,
    variableRegistry: PropTypes.object.isRequired,
    variable: PropTypes.string,
    value: PropTypes.any,
    isEditing: PropTypes.bool,
    onToggleEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChooseVariable: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unusedVariables: [],
    isEditing: false,
    value: null,
    variable: null,
  };

  get variableMeta() {
    return this.props.variableRegistry[this.props.variable];
  }

  get isNew() {
    return !this.props.variable;
  }

  render() {
    const {
      unusedVariables,
      variable,
      value,
      isEditing,
      onToggleEdit,
      onDelete,
      onChooseVariable,
    } = this.props;

    const variableClasses = cx(
      'variable',
      { 'variable--edit': isEditing },
      { 'variable--new': this.isNew },
    );

    return (
      <div
        className={variableClasses}
        onClick={onToggleEdit}
      >
        { !this.isNew &&
          <VariablePreview variable={variable} value={value} onDelete={onDelete} /> }

        <div className="variable__edit">
          <VariableChooser
            show={this.isNew}
            onChooseVariable={onChooseVariable}
            unusedVariables={unusedVariables}
          />
          <VariableEditor
            show={!this.isNew}
            name={variable}
            variableMeta={this.variableMeta}
          />
        </div>
      </div>
    );
  }
}

export { Variable };

export default Variable;
