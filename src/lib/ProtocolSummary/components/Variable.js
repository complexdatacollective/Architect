import React, { useContext } from 'react';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import { getVariableName } from './helpers';

const Variable = ({
  id,
}) => {
  const {
    index,
  } = useContext(SummaryContext);

  return (
    <DualLink
      to={`#variable-${id}`}
      className="protocol-summary-variable"
    >
      {getVariableName(index, id)}
    </DualLink>
  );
};

export default Variable;
