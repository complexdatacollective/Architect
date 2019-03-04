import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ValidatedField, MultiSelect } from '../Form';
import * as Fields from '../../ui/components/Fields';
import SelectOptionImage from '../Form/Fields/SelectOptionImage';
import SelectOptionVariable from '../Form/Fields/SelectOptionVariable';
import Guidance from '../Guidance';
import Disable from '../Disable';
import NodeType from './NodeType';
import { getFieldId } from '../../utils/issues';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';
import optionGetter from './optionGetter';

class FormEditor extends Component {
  handleAttemptTypeChange = () => {
    this.props.openDialog({
      type: 'Confirm',
      title: 'Change node type',
      message: 'Changing the node type now will reset the rest of the form configuration. Do you want to continue?',
      onConfirm: () => { this.props.resetFields(); },
      confirmLabel: 'Continue',
    });
  }

  render() {
    const {
      nodeTypes,
      variables,
    } = this.props;

    return (
      <div>
        <h1 className="editor__heading">Edit Form</h1>

        <Guidance contentId="guidance.form.title">
          <div className="stage-editor-section">
            <h2 id={getFieldId('title')}>Title</h2>
            <ValidatedField
              name="title"
              component={Fields.Text}
              placeholder="Enter your title here"
              validation={{ required: true }}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.type">
          <div className="stage-editor-section">
            <h2 id={getFieldId('type')}>Node Type</h2>
            <Disable
              disabled={!!this.props.nodeType}
              className="stage-editor__reset"
              onClick={this.props.nodeType ? this.handleAttemptTypeChange : () => {}}
            >
              <ValidatedField
                name="type"
                component={Fields.RadioGroup}
                placeholder="Enter your title here"
                className="form-fields-node-select"
                options={nodeTypes}
                validation={{ required: true }}
                optionComponent={NodeType}
              >
                <option value="" disabled>&mdash; Select type &mdash;</option>
              </ValidatedField>
            </Disable>
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.variables">
          <div className="stage-editor-section">
            <h2>Add Variables and Input Types</h2>
            <p>
              Use this section to add variables from the variable registry to the form, and map them
              to your preferred input type.
            </p>
            <MultiSelect
              name="fields"
              properties={[
                {
                  fieldName: 'variable',
                  selectOptionComponent: SelectOptionVariable,
                },
                {
                  fieldName: 'component',
                  selectOptionComponent: SelectOptionImage,
                },
              ]}
              options={optionGetter(variables)}
            />
          </div>
        </Guidance>
      </div>
    );
  }
}

FormEditor.propTypes = {
  resetFields: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
  variables: PropTypes.object.isRequired,
  nodeTypes: PropTypes.array.isRequired,
  openDialog: PropTypes.func.isRequired,
};

FormEditor.defaultProps = {
  nodeType: null,
};

const mapDispatchToProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { FormEditor };

export default connect(null, mapDispatchToProps)(FormEditor);
