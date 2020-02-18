import { useState } from 'react';

const useOtherVariableOption = ({ variableOptions }) => {
  const [otherVariableToggle, setOtherVariableToggle] = useState(false);

  const otherVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'text');

  return [otherVariableToggle, setOtherVariableToggle, otherVariableOptions];
};

export default useOtherVariableOption;
