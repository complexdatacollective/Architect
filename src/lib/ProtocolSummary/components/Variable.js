import React, { useContext } from 'react';
import PropTypes from 'prop-types';
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

Variable.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Variable;
