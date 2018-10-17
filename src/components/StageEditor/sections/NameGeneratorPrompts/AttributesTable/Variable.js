import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import cx from 'classnames';
import VariablePreview from './VariablePreview';
import VariableChooser from './VariableChooser';
import VariableEditor from './VariableEditor';
import { getVariablesForNodeType } from '../../../../../selectors/variableRegistry';

class Variable extends Component {
  static propTypes = {
    unusedVariables: PropTypes.array,
    label: PropTypes.string,
    nodeType: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.array,
    variable: PropTypes.string,
    isEditing: PropTypes.bool,
    onToggleEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChooseVariable: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
  };

  static defaultProps = {
    label: '',
    type: null,
    nodeType: null,
    options: null,
    unusedVariables: [],
    isEditing: false,
    value: undefined,
    variable: null,
  };

  get isNew() {
    return !this.props.variable;
  }

  render() {
    const {
      unusedVariables,
      variable,
      value,
      label,
      type,
      options,
      nodeType,
      isEditing,
      onToggleEdit,
      onDelete,
      onChange,
      onChooseVariable,
    } = this.props;

    const variableClasses = cx(
      'attributes-table-variable',
      { 'attributes-table-variable--edit': isEditing },
      { 'attributes-table-variable--new': this.isNew },
    );

    return (
      <div
        className={variableClasses}
        onClick={onToggleEdit}
      >
        { !this.isNew &&
          <div className="attributes-table-variable__preview">
            <Field
              name={variable}
              variable={variable}
              label={label}
              component={VariablePreview}
              onDelete={onDelete}
            />
          </div>
        }

        <div className="attributes-table-variable__edit">
          <VariableChooser
            show={this.isNew}
            nodeType={nodeType}
            onChooseVariable={onChooseVariable}
            unusedVariables={unusedVariables}
          />
          <VariableEditor
            show={!this.isNew}
            value={value}
            variable={variable}
            type={type}
            label={label}
            onChange={onChange}
            options={options}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  if (!props.variable) { return {}; }

  const variablesForNodeType = getVariablesForNodeType(state, props.nodeType);
  const variableMeta = variablesForNodeType[props.variable];

  return {
    label: variableMeta.label,
    type: variableMeta.type,
    options: variableMeta.options || null,
  };
};

export { Variable };

export default connect(mapStateToProps)(Variable);
