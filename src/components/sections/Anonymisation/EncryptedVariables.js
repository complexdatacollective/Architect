import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Section, Row } from '@components/EditorLayout';
import { getNodeTypes } from '@selectors/codebook';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const EncryptedVariables = () => {
  const dispatch = useDispatch();
  const nodeTypes = useSelector((state) => getNodeTypes(state));

  const [expandedNodeTypes, setExpandedNodeTypes] = useState({});

  const handleEncryptionToggle = (variableId, encrypted) => {
    const action = codebookActions.updateVariableByUUID(variableId, { encrypted }, true);
    dispatch(action);
  };

  const handleNodeTypeToggle = (nodeTypeId) => {
    setExpandedNodeTypes((prevState) => ({
      ...prevState,
      [nodeTypeId]: !prevState[nodeTypeId],
    }));
  };

  return (
    <Section
      title="Encrypted Variables"
      summary={(
        <p>
          Select the variables that should be encrypted.
        </p>
      )}
    >
      {Object.entries(nodeTypes).map(([nodeTypeId, nodeType]) => (
        <div key={nodeTypeId}>
          <h3 onClick={() => handleNodeTypeToggle(nodeTypeId)}>
            {nodeType.name}
          </h3>

          {expandedNodeTypes[nodeTypeId] && (
            <div>
              {Object.entries(nodeType.variables || {}).map(([variableId, variable]) => {
                // Skip layout variables
                if (variable.type === 'layout') return null;

                return (
                  <Row key={variableId}>
                    <Fields.Checkbox
                      label={variable.name}
                      input={{
                        value: variable.encrypted || false,
                        onChange: () => handleEncryptionToggle(variableId, !variable.encrypted),
                      }}
                    />
                  </Row>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </Section>
  );
};

export default EncryptedVariables;
