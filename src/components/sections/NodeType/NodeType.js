import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '../../../ui/components/Button';
import { getFieldId } from '../../../utils/issues';
import NodeSelect from '../../Form/Fields/NodeSelect';
import ValidatedField from '../../Form/ValidatedField';
import withDisableAndReset from './withDisableAndReset';
import withCreateNewType from './withCreateNewType';
import withNodeTypeOptions from './withNodeTypeOptions';
import withDisplayVariableOptions from './withDisplayVariableOptions';
import Section from '../Section';
import Row from '../Row';

class NodeType extends Component {
  static propTypes = {
    nodeTypes: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    typeScreenMessage: PropTypes.any,
    handleResetStage: PropTypes.func.isRequired,
    handleOpenCreateNewType: PropTypes.func.isRequired,
    handleTypeScreenMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    nodeTypes: [],
    disabled: false,
    displayVariable: null,
    typeScreenMessage: null,
  };

  componentDidUpdate() {
    this.props.handleTypeScreenMessage(this.props.typeScreenMessage);
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
      <Section contentId="guidance.editor.node_type" className={nodeTypeClasses}>
        <Row>
          <div id={getFieldId('subject')} data-name="Node type" />
          <h2>Node Type</h2>
          <p>Which node type is used on this stage?</p>
          <div
            className="stage-editor-section-node-type__edit"
            onClick={handleResetStage}
          >
            <div className="stage-editor-section-node-type__edit-capture">
              <ValidatedField
                name="subject"
                parse={value => ({ type: value, entity: 'node' })}
                format={value => get(value, 'type')}
                options={nodeTypes}
                component={NodeSelect}
                validation={{ required: true }}
              />

              { nodeTypes.length === 0 &&
                <p className="stage-editor-section-node-type__empty">
                  No node types currently defined. Use the button below to create one.
                </p>
              }

              <Button
                color="primary"
                icon="add"
                size="small"
                onClick={handleOpenCreateNewType}
              >
                Create new node type
              </Button>
              { nodeTypes.length !== 0 &&
              <strong>
            Tip: ensure you create and assign a variable called &quot;name&quot; for this node type,
            unless you have a good reason not to. Network Canvas automatically use this
            variable as the visual label for the node in the interview.
              </strong>
              }
            </div>
          </div>
        </Row>
      </Section>
    );
  }
}

export { NodeType };

export default compose(
  withNodeTypeOptions,
  withDisplayVariableOptions,
  withDisableAndReset,
  withCreateNewType,
)(NodeType);
