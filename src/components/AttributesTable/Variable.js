import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { getFieldId } from '../../utils/issues';
import VariablePreview from './VariablePreview';
import VariableChooser from './VariableChooser';
import VariableEditor from './VariableEditor';

class Variable extends Component {
  static propTypes = {
    unusedVariables: PropTypes.array,
    label: PropTypes.string,
    nodeType: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.array,
    variable: PropTypes.string,
    validation: PropTypes.object,
    isEditing: PropTypes.bool,
    onToggleEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChooseVariable: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
    name: PropTypes.string.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    error: undefined,
    type: null,
    nodeType: null,
    options: null,
    validation: {},
    unusedVariables: [],
    isEditing: false,
    value: undefined,
    variable: null,
  };

  get isNew() {
    return !this.props.variable;
  }

  handleChange = (value) => {
    const { onChange, variable } = this.props;
    onChange({ [variable]: value });
  }

  render() {
    const {
      unusedVariables,
      variable,
      validation,
      value,
      label,
      type,
      name,
      error,
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
        id={getFieldId(name)}
        data-name={`Additional attributes: ${label}`}
      >
        { !this.isNew &&
          <div className="attributes-table-variable__preview">
            <VariablePreview
              label={label}
              value={value}
              error={error}
              variable={variable}
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
            validation={validation}
            type={type}
            label={label}
            onChange={this.handleChange}
            options={options}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { variablesForNodeType, ...props }) => {
  if (!props.variable) { return {}; }

  const variable = get(variablesForNodeType, props.variable, {});
  const validation = get(variable, 'validation', []);
  const label = get(variable, 'label', '');
  const type = get(variable, 'type', '');
  const options = get(variable, 'options', null);


  return {
    validation,
    label,
    type,
    options,
  };
};

export { Variable };

export default connect(mapStateToProps)(Variable);
