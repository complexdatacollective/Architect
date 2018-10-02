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
  };

  static defaultProps = {
    label: '',
    type: null,
    nodeType: null,
    options: null,
    unusedVariables: [],
    isEditing: false,
    value: null,
    variable: null,
  };

  get isNew() {
    return !this.props.variable;
  }

  render() {
    const {
      unusedVariables,
      variable,
      label,
      type,
      options,
      nodeType,
      isEditing,
      onToggleEdit,
      onDelete,
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
            name={variable}
            type={type}
            label={label}
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
    label: variableMeta.name,
    type: variableMeta.type,
    options: variableMeta.options || null,
  };
};

export { Variable };

export default connect(mapStateToProps)(Variable);
