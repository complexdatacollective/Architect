import React, { useEffect } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import { getFieldId } from '@app/utils/issues';
import NodeSelect from '@components/Form/Fields/NodeSelect';
import ValidatedField from '@components/Form/ValidatedField';
import Tip from '@components/Tip';
import withDisableAndReset from './withDisableAndReset';
import withCreateNewType from './withCreateNewType';
import withNodeTypeOptions from './withNodeTypeOptions';
import withSubjectVariables from './withSubjectHasNameVariable';

const NodeType = ({
  disabled,
  nodeTypes,
  handleResetStage,
  handleOpenCreateNewType,
  handleTypeScreenMessage,
  typeScreenMessage,
  subjectHasVariableCalledName,
  type,
}) => {
  useEffect(() => {
    handleTypeScreenMessage(typeScreenMessage);
  });

  const nodeTypeClasses = cx(
    'stage-editor-section-node-type',
    { 'stage-editor-section-node-type--disabled': disabled },
  );

  return (
    <div className={nodeTypeClasses}>
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
          { nodeTypes.length !== 0 && type && !subjectHasVariableCalledName &&
          <Tip type="warning">
            <p>
              Ensure you create and assign a variable called &quot;name&quot; for this
              node type, unless you have a good reason not to. Network Canvas will then
              automatically use this variable as the label for the node in the interview.
            </p>
          </Tip>
          }
        </div>
      </div>
    </div>
  );
};

NodeType.propTypes = {
  nodeTypes: PropTypes.arrayOf(PropTypes.object),
  handleResetStage: PropTypes.func.isRequired,
  handleOpenCreateNewType: PropTypes.func.isRequired,
  subjectHasVariableCalledName: PropTypes.bool.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  handleTypeScreenMessage: PropTypes.func.isRequired,
  typeScreenMessage: PropTypes.any,
};

NodeType.defaultProps = {
  nodeTypes: [],
  disabled: false,
  displayVariable: null,
  typeScreenMessage: null,
  type: null,
};

export { NodeType };

export default compose(
  withNodeTypeOptions,
  withSubjectVariables,
  withDisableAndReset,
  withCreateNewType,
)(NodeType);
