/* eslint-disable */

import React, { Component } from 'react';
import { toPairs, get } from 'lodash';
import { Button } from 'network-canvas-ui';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SeamlessTextInput from './SeamlessTextInput';
// import Button from './Button';
import Select from './Select';
import Modal from '../Modal';

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

  onChangeVariable = (name, value) => {
    this.props.onChange({ ...this.props.values, [name]: value })
  }

  render() {
    const { values, variables, className } = this.props;
    const variableChooserClasses = cx('variable-chooser', className);

    return (
      <div className={variableChooserClasses}>
        <div className="variable-chooser__variables">
          { toPairs(values).map(([name, value]) => (
            <div
              key={name}
              onClick={() => this.editVariable(name)}
              className="variable-chooser__variable"
            >
              <strong>{name}</strong>: <em>{value}</em>
            </div>
          )) }
          <Button
            className="variable-chooser__add"
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
                  onChange={event => this.editVariable(event.target.value)}
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
                <SeamlessTextInput
                  className="variable-chooser__modal-value"
                  onChange={(newValue) => this.onChangeVariable(this.state.editing, newValue)}
                  value={get(values, this.state.editing)}
                />
              </div>
            }
            <div className="variable-chooser__modal-controls">
              <Button
                onClick={this.closeEditVariable}
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
}

export { VariableChooser };

export default VariableChooser;
