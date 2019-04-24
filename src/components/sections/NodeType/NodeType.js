import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '../../../ui/components/Button';
import { getFieldId } from '../../../utils/issues';
import Guidance from '../../Guidance';
import NodeSelect from '../../Form/Fields/NodeSelect';
import Select from '../../Form/Fields/Select';
import ValidatedField from '../../Form/ValidatedField';
import DetachedField from '../../DetachedField';
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
    displayVariable: PropTypes.string,
    handleChangeDisplayVariable: PropTypes.func.isRequired,
    displayVariableOptions: PropTypes.array.isRequired,
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
      displayVariable,
      handleChangeDisplayVariable,
      displayVariableOptions,
    } = this.props;

    const nodeTypeClasses = cx('stage-editor-section', 'stage-editor-section-node-type', { 'stage-editor-section-node-type--disabled': disabled });

    return (
      <Guidance contentId="guidance.editor.node_type">
        <Section className={nodeTypeClasses}>
          <Row>
            <div id={getFieldId('subject')} data-name="Node type" />
            <h2>Node Type</h2>
            <p>Which node type is used on this interface?</p>
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
              </div>
            </div>
          </Row>

          { disabled &&
            <Row>
              <DetachedField
                label="Display varible"
                component={Select}
                placeholder="&mdash; Select or create a display variable &mdash;"
                value={displayVariable}
                onChange={handleChangeDisplayVariable}
                options={displayVariableOptions}
              />
            </Row>
          }
        </Section>
      </Guidance>
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
