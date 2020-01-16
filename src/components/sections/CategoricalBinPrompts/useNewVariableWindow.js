import React, { useState } from 'react';
import NewVariableWindow from '@components/NewVariableWindow';
import { useStack } from '@components/Stack';

const useNewVariableWindow = (entityType, variableType, onCreate) => {
  const [newVariableName, setNewVariableName] = useState(null);

  const closeWindow = () =>
    setNewVariableName(null);

  const handleCreateNewVariable = (variableId) => {
    onCreate(variableId);
    closeWindow();
  };

  useStack(stackProps => (
    <NewVariableWindow
      initialValues={{
        type: variableType,
        name: newVariableName,
      }}
      show={!!newVariableName}
      onComplete={handleCreateNewVariable}
      onCancel={closeWindow}
      {...stackProps}
      {...entityType}
    />
  ), [newVariableName, variableType, entityType.type, entityType.entity]);

  return [setNewVariableName];
};

export default useNewVariableWindow;
