import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Section } from '@components/EditorLayout';
import { getNodeTypes } from '@selectors/codebook';
import * as Fields from '@codaco/ui/lib/components/Fields';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Button } from '@codaco/ui';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import EntityIcon from '../../Codebook/EntityIcon';

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
        <div
          key={nodeTypeId}
          style={{
            overflow: 'hidden',
            margin: '2.4rem auto',
            padding: '2.4rem',
            background: 'var(--architect-panel-grey--dark)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="codebook__entity-icon">
              <EntityIcon entity="node" color={nodeType.color} />
            </div>
            <h3 style={{ marginLeft: '18px' }}>
              {nodeType.name}
            </h3>
            <Button
              onClick={() => handleNodeTypeToggle(nodeTypeId)}
              style={{ marginLeft: 'auto' }}
              icon={
                expandedNodeTypes[nodeTypeId] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
              }
              size="small"
            />

          </div>
          {expandedNodeTypes[nodeTypeId] && (
          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingTop: '1rem' }}>
            <Fields.CheckboxGroup
              options={Object.entries(nodeType.variables || {})
                .map(([variableId, variable]) => ({
                  value: variableId,
                  label: variable.name,
                }))}
              input={{
                value: Object.entries(nodeType.variables || {})
                  .filter(([, variable]) => variable.encrypted)
                  .map(([variableId]) => variableId),
                onChange: (selectedValues) => {
                  Object.entries(nodeType.variables || {}).forEach(([variableId, variable]) => {
                    const shouldEncrypt = selectedValues.includes(variableId);
                    if (variable.encrypted !== shouldEncrypt) {
                      handleEncryptionToggle(variableId, shouldEncrypt);
                    }
                  });
                },
              }}
            />
          </div>
          )}
        </div>
      ))}
    </Section>
  );
};

export default EncryptedVariables;
