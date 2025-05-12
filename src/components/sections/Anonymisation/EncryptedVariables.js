import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Section } from '@components/EditorLayout';
import { getNodeTypes } from '@selectors/codebook';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { actionCreators as dialogActions } from '@modules/dialogs';

import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const EncryptedVariables = () => {
  const dispatch = useDispatch();
  const openDialog = useCallback(
    (dialog) => dispatch(dialogActions.openDialog(dialog)),
    [dispatch],
  );
  const nodeTypes = useSelector((state) => getNodeTypes(state));

  const handleEncryptionToggle = (variableId, encrypted) => {
    const action = codebookActions.updateVariableByUUID(variableId, { encrypted }, true);
    dispatch(action);
  };
  const handleToggleChange = useCallback(
    async (hasEncryptedVariable, nodeType, newState) => {
      if (!hasEncryptedVariable || newState === true) {
        return true;
      }

      const confirm = await openDialog({
        type: 'Warning',
        title: 'This will clear selected variables',
        message: `This will deselect all encrypted variables for the ${nodeType.name} node type. Do you want to continue?`,
        confirmLabel: 'Clear encrypted variables',
      });

      if (confirm) {
        Object.entries(nodeType.variables || {}).forEach(([variableId, variable]) => {
          if (variable.encrypted) {
            handleEncryptionToggle(variableId, false);
          }
        });
        return true;
      }

      return false;
    },
    [openDialog],
  );
  return (
    <Section
      title="Encrypted Variables"
      summary={(
        <p>
          Select the variables that should be encrypted.
        </p>
      )}
    >
      {Object.entries(nodeTypes).map(([nodeTypeId, nodeType]) => {
        const hasEncryptedVariable = Object.values(nodeType.variables || {})
          .some((variable) => variable.encrypted);

        return (
          <Section
            toggleable
            title={nodeType.name}
            key={nodeTypeId}
            startExpanded={hasEncryptedVariable}
            // eslint-disable-next-line max-len
            handleToggleChange={(newState) => handleToggleChange(hasEncryptedVariable, nodeType, newState)}
          >
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                paddingTop: '1rem',
              }}
            >
              <Fields.CheckboxGroup
                options={Object.entries(nodeType.variables || {}).map(
                  ([variableId, variable]) => ({
                    value: variableId,
                    label: variable.name,
                  }),
                )}
                input={{
                  value: Object.entries(nodeType.variables || {})
                    .filter(([, variable]) => variable.encrypted)
                    .map(([variableId]) => variableId),
                  onChange: (selectedValues) => {
                    Object.entries(nodeType.variables || {}).forEach(
                      ([variableId, variable]) => {
                        const shouldEncrypt = selectedValues.includes(variableId);
                        if (variable.encrypted !== shouldEncrypt) {
                          handleEncryptionToggle(variableId, shouldEncrypt);
                        }
                      },
                    );
                  },
                }}
              />
            </div>
          </Section>
        );
      })}
    </Section>
  );
};

export default EncryptedVariables;
