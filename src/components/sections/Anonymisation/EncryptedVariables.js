import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Section, Row } from '@components/EditorLayout';
import { getNodeTypes } from '@selectors/codebook';
// import { SimpleVariablePill } from '@components/Form/Fields/VariablePicker/VariablePill';
import { MarkdownLabel } from '@codaco/ui/lib/components/Fields';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const EncryptedVariables = () => {
  const dispatch = useDispatch();
  const nodeTypes = useSelector((state) => getNodeTypes(state));

  const handleEncryptionToggle = (variableId, encrypted) => {
    const action = codebookActions.updateVariableByUUID(variableId, { encrypted }, true);
    dispatch(action);
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
        <div key={nodeTypeId} className="codebook__entity-variables">
          <h3>
            {nodeType.name}
          </h3>

          {Object.entries(nodeType.variables || {}).map(([variableId, variable]) => {
            // Skip layout variables
            if (variable.type === 'layout') return null;

            return (
              <Row key={variableId}>
                <input
                  type="checkbox"
                  checked={variable.encrypted || false}
                  onChange={() => handleEncryptionToggle(variableId, !variable.encrypted)}
                />

                <MarkdownLabel label={variable.name} />
              </Row>
            );
          })}
        </div>
      ))}
    </Section>
  );
};

export default EncryptedVariables;
