import React, { Component } from 'react';
import { toPairs, get, toPath, last } from 'lodash';
import { Button } from 'network-canvas-ui';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector, FormSection } from 'redux-form';
import cx from 'classnames';
import SeamlessTextInput from './SeamlessTextInput';
import OptionsInput from './OptionsInput';
import ValidatedField from './ValidatedField';
import Select from './Select';
import Modal from '../Modal';

const getGeneralComponentProps = ({ validation }) => ({
  className: 'variable-chooser__modal-value',
  validation,
});

const getEditComponentProps = (variables, variableName) => {
  const variable = get(variables, variableName, {});
  const generalComponentProps = getGeneralComponentProps(variable);

  switch (variable.type) {
    case 'boolean':
      return {
        ...generalComponentProps,
        component: OptionsInput,
        options: [true, false],
        optionComponent: ({ label }) => (<div>{label}</div>), // eslint-disable-line
      };
    case 'number':
      return {
        ...generalComponentProps,
        component: SeamlessTextInput,
        type: variable.type,
      };
    case 'enumerable':
    case 'options':
      return {
        ...generalComponentProps,
        component: OptionsInput,
        options: variable.options,
        optionComponent: ({ label }) => (<div>{label}</div>), // eslint-disable-line
      };
    case 'text':
    default:
      return {
        ...generalComponentProps,
        component: SeamlessTextInput,
        type: 'text',
      };
  }
};

// eslint-disable-next-line
const Tag = ({ editVariable, meta: { invalid }, input: { name: fieldName, value: fieldValue } }) => {
  const variableName = last(toPath(fieldName));
  const tagClasses = cx(
    'variable-chooser__variable',
    { 'variable-chooser__variable--has-error': invalid },
  );
  const displayValue = JSON.stringify(fieldValue);

  return (
    <div
      key={fieldName}
      onClick={() => editVariable(variableName)}
      className={tagClasses}
    >
      <strong>{variableName}</strong>: <em>{displayValue}</em>
    </div>
  );
};

class VariableChooser extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    values: PropTypes.object,
    variableRegistry: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    values: {},
    variableRegistry: {},
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      isEditing: false,
    };
  }

  editVariable = (variable) => {
    this.setState({ isEditing: true, editing: variable });
  };

  openEditVariable = () => {
    this.setState({ isEditing: true, editing: null });
  };

  closeEditVariable = () => {
    this.setState({ isEditing: false, editing: null });
  };

  render() {
    const { name, values, variableRegistry, className } = this.props;
    const variableChooserClasses = cx('variable-chooser', className);

    return (
      <div className={variableChooserClasses}>
        <FormSection name={name}>
          <div className="variable-chooser__variables">
            {
              toPairs(values)
                .map(([variableName]) => (
                  <ValidatedField
                    key={variableName}
                    name={variableName}
                    component={Tag}
                    editVariable={this.editVariable}
                    validation={get(variableRegistry, [variableName, 'validation'], {})}
                  />
                ))
            }
            <Button
              className="variable-chooser__add"
              type="button"
              onClick={this.openEditVariable}
            />
          </div>
          <Modal show={!!this.state.isEditing}>
            <div className="variable-chooser__modal">
              <h2 className="variable-chooser__modal-title">
                {
                  this.state.editing ?
                    this.state.editing :
                    'Please select a variable to add/edit'
                }
              </h2>
              { !this.state.editing ?
                <div className="variable-chooser__modal-setting">
                  <Select
                    className="variable-chooser__modal-value"
                    onChange={this.editVariable}
                    defaultValue=""
                    value={this.state.editing || ''}
                  >
                    <option value="" disabled>Variable name...</option>
                    {
                      toPairs(variableRegistry)
                        .map(([variableName]) => (
                          <option key={variableName} value={variableName}>{variableName}</option>
                        ))
                    }
                  </Select>
                </div> :
                <div className="variable-chooser__modal-setting">
                  <ValidatedField
                    {...getEditComponentProps(variableRegistry, this.state.editing)}
                    name={`${this.state.editing}`}
                  />
                </div>
              }
              <div className="variable-chooser__modal-controls">
                <Button
                  onClick={this.closeEditVariable}
                  type="button"
                  size="small"
                >
                  {
                    this.state.editing ?
                      'Done' :
                      'Cancel'
                  }
                </Button>
              </div>
            </div>
          </Modal>
        </FormSection>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  values: formValueSelector('edit-stage')(state, props.name),
});

export { VariableChooser };

export default compose(
  connect(mapStateToProps),
)(VariableChooser);
