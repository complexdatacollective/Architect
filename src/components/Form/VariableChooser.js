/* eslint-disable */

import React, { Component } from 'react';
import { toPairs, get } from 'lodash';
import { Button } from 'network-canvas-ui';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector, Field, FieldArray } from 'redux-form';
import cx from 'classnames';
import SeamlessTextInput from './SeamlessTextInput';
import Select from './Select';
import Modal from '../Modal';

const getEditComponent = (options) => {
  return (props) => <input {...props} />;

  switch(options.type) {
    case 'boolean':
      return (
        <div className="variable-chooser__modal-value">
          <input type="radio" name={name} value="true" onChange={(event) => onChange(event.target.value)} /> True
          <input type="radio" name={name} value="false" onChange={(event) => onChange(event.target.value)} /> False
        </div>
      );
    case 'number':
      return (
        <SeamlessTextInput
          className="variable-chooser__modal-value"
          onChange={onChange}
          type={options.type}
          value={value}
        />
      );
    case 'enumerable':
    case 'options':
      return (
        <div className="variable-chooser__modal-value">
          {options.options.map((option) => (
            <div>
              <input
                type="radio"
                name={name}
                value={option}
                onChange={(event) => onChange(event.target.value)}
                checked={value == option}
              /> {option}
            </div>
          ))}
        </div>
      );
    case 'text':
    default:
      return (
        <SeamlessTextInput
          className="variable-chooser__modal-value"
          onChange={onChange}
          value={value}
        />
      );
  }
}

const TagList = ({ editVariable, input: { value } }) => {
  return toPairs(value)
    .map(([name, value]) => (
      <div
        key={name}
        onClick={() => editVariable(name)}
        className="variable-chooser__variable"
      >
        <strong>{name}</strong>: <em>{value}</em>
      </div>
    ));
};

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
        <div className="variable-chooser__variables">
          <Field
            name={name}
            component={TagList}
            editVariable={this.editVariable}
          />
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
                <Field
                  component="input"
                  type="text"
                  name={`${name}[${this.state.editing}]`}
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
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  values: formValueSelector('edit-stage'),
});

export { VariableChooser };

export default compose(
  connect(mapStateToProps),
)(VariableChooser);
