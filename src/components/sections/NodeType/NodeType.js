import React, { Component } from 'react';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import Guidance from '../../Guidance';
import NodeSelect from '../../Form/Fields/NodeSelect';
import Node from '../../../ui/components/Node';
import { getFieldId } from '../../../utils/issues';
import withDisableAndReset from './withDisableAndReset';
import withCreateNewType from './withCreateNewType';
import withNodeTypeOptions from './withNodeTypeOptions';

class NodeType extends Component {
  static propTypes = {
    nodeTypes: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    handleResetStage: PropTypes.func.isRequired,
    handleOpenCreateNewType: PropTypes.func.isRequired,
    handleUIMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    nodeTypes: [],
    disabled: false,
  };

  componentDidUpdate({ ui: prevMessage }) {
    this.props.handleUIMessage(prevMessage);
  }

  render() {
    const {
      nodeTypes,
      disabled,
      handleResetStage,
      handleOpenCreateNewType,
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
            onClick={handleResetStage}
          >
            <div className="stage-editor-section-node-type__edit-capture">
              <Field
                name="subject"
                parse={value => ({ type: value, entity: 'node' })}
                format={value => get(value, 'type')}
                options={nodeTypes}
                component={NodeSelect}
              >
                <div className="preview-node"onClick={handleOpenCreateNewType}>
                  <Node label="+" />
                </div>
              </Field>
            </div>
          </div>
        </div>
      </Guidance>
    );
  }
}

export { NodeType };

export default compose(
  withNodeTypeOptions,
  withDisableAndReset,
  withCreateNewType,
)(NodeType);
