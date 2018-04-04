import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { toPairs, get, omit } from 'lodash';
import { Button } from 'network-canvas-ui';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { FormSection, change } from 'redux-form';
import cx from 'classnames';
import Modal from '../../../Modal';
import SeamlessTextInput from '../../SeamlessTextInput';
import OptionsInput from '../../OptionsInput';
import ValidatedField from '../../ValidatedField';
import Select from '../Select';
import Tag from './Tag';

const getGeneralComponentProps = ({ validation }) => ({
  className: 'form-fields-variable-chooser__modal-value',
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

class VariableChooser extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    values: PropTypes.object,
    variableRegistry: PropTypes.object,
    deleteVariable: PropTypes.func.isRequired,
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
    const { name, values, variableRegistry, className, deleteVariable } = this.props;
    const variableChooserClasses = cx('form-fields-variable-chooser', className);

    return (
      <div className={variableChooserClasses}>
        <FormSection name={name}>
          <div className="form-fields-variable-chooser__variables">
            {
              toPairs(values)
                .map(([variableName]) => (
                  <ValidatedField
                    name={variableName}
                    component={Tag}
                    editVariable={this.editVariable}
                    deleteVariable={deleteVariable}
                    validation={get(variableRegistry, [variableName, 'validation'], {})}
                  />
                ))
            }
            <Button
              className="form-fields-variable-chooser__add"
              type="button"
              onClick={this.openEditVariable}
            />
          </div>
          <Modal show={!!this.state.isEditing}>
            <div className="form-fields-variable-chooser__modal">
              <h2 className="form-fields-variable-chooser__modal-title">
                {
                  this.state.editing ?
                    this.state.editing :
                    'Please select a variable to add/edit'
                }
              </h2>
              { !this.state.editing ?
                <div className="form-fields-variable-chooser__modal-setting">
                  <Select
                    className="form-fields-variable-chooser__modal-value"
                    input={{
                      onChange: this.editVariable,
                      value: this.state.editing || '',
                    }}
                    defaultValue=""
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
                <div className="form-fields-variable-chooser__modal-setting">
                  <ValidatedField
                    {...getEditComponentProps(variableRegistry, this.state.editing)}
                    name={`${this.state.editing}`}
                  />
                </div>
              }
              <div className="form-fields-variable-chooser__modal-controls">
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

const mapStateToProps = (state, { name, form }) => ({
  values: form.getValues(state, name),
});

const mapDispatchToProps = (dispatch, { name, form }) => ({
  change: bindActionCreators(
    value => change(form.name, name, value),
    dispatch,
  ),
});

export { VariableChooser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    deleteVariable: props => variable =>
      props.change(omit(props.values, variable)),
  }),
)(VariableChooser);
