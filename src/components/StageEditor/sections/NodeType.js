import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, has, difference } from 'lodash';
import cx from 'classnames';
import Guidance from '../../Guidance';
import Contexts from '../../../components/Form/Fields/Contexts';

class NodeType extends Component {
  static propTypes = {
    nodeTypes: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    stage: PropTypes.object.isRequired,
    resetField: PropTypes.func.isRequired,
  };

  static defaultProps = {
    nodeTypes: [],
    disabled: false,
  };

  resetStage() {
    const { stage, resetField } = this.props;
    // eslint-disable-next-line
    if (confirm('First you will need to reset the rest of the stage, are you sure?')) {
      const fieldsToReset = difference(keys(stage), ['id', 'type', 'label']);

      fieldsToReset.forEach(resetField);
    }
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
          <h2>Node Type</h2>
          <p>Which type of node does this name generator create?</p>
          <div
            className="stage-editor-section-node-type__edit"
            onClick={disabled ? () => this.resetStage() : () => {}}
          >
            <div className="stage-editor-section-node-type__edit-capture">
              <Field
                name="subject"
                parse={value => ({ type: value, entity: 'node' })}
                format={value => get(value, 'type')}
                options={nodeTypes}
                component={Contexts}
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

  return {
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    disabled: has(stage, 'subject.type'),
    stage,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  resetField: field => dispatch(changeField(form.name, field, null)),
});

export { NodeType };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeType);
