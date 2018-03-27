/* eslint-disable */

import React, { Component } from 'react';
import { toPairs, get, sortBy, toPath, last } from 'lodash';
import { Button } from 'network-canvas-ui';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector, FieldArray, Field, FormSection } from 'redux-form';
import cx from 'classnames';
import SeamlessTextInput from './SeamlessTextInput';
import OptionsInput from './OptionsInput'
import ValidatedField from './ValidatedField'
import Select from './Select';
import Modal from '../Modal';

const getGeneralComponentProps = ({ validation, ...rest }) => ({
  className: 'variable-chooser__modal-value',
  validation,
});

const getEditComponentProps = (variables, variableName) => {
  const variable = get(variables, variableName, {});
  const generalComponentProps = getGeneralComponentProps(variable);

  switch(variable.type) {
    case 'boolean':
      return {
        ...generalComponentProps,
        component: OptionsInput,
        options: [true, false],
        optionComponent: ({ label }) => (<div>{label}</div>),
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
        optionComponent: ({ label }) => (<div>{label}</div>),
      };
    case 'text':
    default:
      return {
        ...generalComponentProps,
        component: SeamlessTextInput,
        type: 'text',
      };
  }
}

const Tag = ({ editVariable, meta, input: { name: fieldName, value: fieldValue } }) => {
  const variableName = last(toPath(fieldName));
  console.log(meta);
  return (
    <div
      key={fieldName}
      onClick={() => editVariable(variableName)}
      className="variable-chooser__variable"
    >
      <strong>{variableName}</strong>: <em>{JSON.stringify(fieldValue)}</em>
    </div>
  );
}

class VariableChooser extends Component {
  static propTypes = {
    values: PropTypes.object,
    variables: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    values: {},
    variables: {},
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
    const { name, values, variables, className } = this.props;
    const variableChooserClasses = cx('variable-chooser', className);

    return (
      <div className={variableChooserClasses}>
        <FormSection name={name}>
          <div className="variable-chooser__variables">
              { toPairs(values).map(([name, value]) => {
                console.log('tags', name, get(variables, [name, 'validation'], {}));
                return (
                  <ValidatedField
                    name={name}
                    component={Tag}
                    editVariable={this.editVariable}
                    validation={get(variables, [name, 'validation'], {})}
                  />
                );
              }) }
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
                  !!this.state.editing ?
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
                    { toPairs(variables).map(([name]) => (
                      <option key={name} value={name}>{name}</option>
                    )) }
                  </Select>
                </div> :
                <div className="variable-chooser__modal-setting">
                  <ValidatedField
                    {...getEditComponentProps(variables, this.state.editing)}
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
                    !!this.state.editing ?
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
};

const mapStateToProps = (state, props) => ({
  values: formValueSelector('edit-stage')(state, props.name),
});

export { VariableChooser };

export default compose(
  connect(mapStateToProps),
)(VariableChooser);
