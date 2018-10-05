import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, map, difference } from 'lodash';
import cx from 'classnames';
import Guidance from '../../Guidance';
import NodeSelect from '../../../components/Form/Fields/NodeSelect';
import { getNodeTypes } from '../../../selectors/variableRegistry';
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
      title: 'Reset node type',
      message: 'First you will need to reset the rest of the stage, are you sure?',
      confirm: this.resetStage,
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
          <p>Which node type does this name generator create?</p>
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
  const stage = getFormValues(form.name)(state);
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
  resetField: field => dispatch(changeField(form.name, field, null)),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { NodeType };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeType);
