import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, map, difference } from 'lodash';
import cx from 'classnames';
import Guidance from '../../Guidance';
import NodeSelect from '../../Form/Fields/NodeSelect';
import { getNodeTypes } from '../../../selectors/codebook';
import { getFieldId } from '../../../utils/issues';
import { actionCreators as dialogsActions } from '../../../ducks/modules/dialogs';

class NodeType extends Component {
  static propTypes = {
    nodeTypes: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    stage: PropTypes.object.isRequired,
    resetField: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    nodeTypes: [],
    disabled: false,
  };

  handleResetStage = () => {
    this.props.openDialog({
      type: 'Confirm',
      title: 'Change node type for this stage',
      message: 'You attemped to change the node type of a stage that you have already configured. Before you can procede the stage must be reset, which will remove any existing configuration. Do you want to reset the stage now?',
      onConfirm: this.resetStage,
      confirmLabel: 'Continue',
    });
  }

  resetStage = () => {
    const { stage, resetField } = this.props;
    const fieldsToReset = difference(keys(stage), ['id', 'type', 'label']);
    fieldsToReset.forEach(resetField);
  }

  render() {
    const {
      nodeTypes,
      disabled,
    } = this.props;

    const nodeTypeClasses = cx('stage-editor-section', 'stage-editor-section-node-type', { 'stage-editor-section-node-type--disabled': disabled });

    return (
      <Guidance contentId="guidance.editor.node_type">
        <div className={nodeTypeClasses}>
          <div id={getFieldId('subject')} data-name="Node type" />
          <h2>Node Type</h2>
          <p>Which node type is used on this interface?</p>
          <div
            className="stage-editor-section-node-type__edit"
            onClick={disabled ? () => this.handleResetStage() : () => {}}
          >
            <div className="stage-editor-section-node-type__edit-capture">
              <Field
                name="subject"
                parse={value => ({ type: value, entity: 'node' })}
                format={value => get(value, 'type')}
                options={nodeTypes}
                component={NodeSelect}
              />
            </div>
          </div>
        </div>
      </Guidance>
    );
  }
}

const mapStateToProps = (state, { form }) => {
  const stage = getFormValues(form)(state);
  const nodeTypes = map(
    getNodeTypes(state),
    (nodeOptions, promptNodeType) => ({
      label: get(nodeOptions, 'label', ''),
      value: promptNodeType,
      color: get(nodeOptions, 'color', ''),
    }),
  );
  const disabled = !!get(stage, 'subject.type', false);

  return {
    nodeTypes,
    disabled,
    stage,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  resetField: field => dispatch(changeField(form, field, null)),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { NodeType };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeType);
