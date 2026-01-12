import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SimpleVariablePill } from '@components/Form/Fields/VariablePicker/VariablePill';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import { getVariableName, getVariableMeta } from './helpers';

const Variable = ({
  id,
}) => {
  if (!id) return null;

  const {
    index,
  } = useContext(SummaryContext);
  const meta = getVariableMeta(index, id);

  return (
    <DualLink
      to={`#variable-${id}`}
      className="protocol-summary-variable"
    >
      <SimpleVariablePill label={getVariableName(index, id)} type={meta.type} />
    </DualLink>
  );
};

Variable.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Variable;
