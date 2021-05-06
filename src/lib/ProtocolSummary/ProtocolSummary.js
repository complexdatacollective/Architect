import React from 'react';
import PropTypes from 'prop-types';
import Codebook from './components/Codebook';
import Stages from './components/Stages';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';

const ProtocolSummary = ({ protocol }) => {
  if (!protocol) { return null; }

  const index = getCodebookIndex(protocol);

  return (
    <SummaryContext.Provider value={{ protocol, index }}>
      <div className="printable-summary">
        <h1>Protocol Summary</h1>

        <Stages />

        <Codebook />

      </div>
    </SummaryContext.Provider>
  );
};

ProtocolSummary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  protocol: PropTypes.object,
};

ProtocolSummary.defaultProps = {
  protocol: {},
};

export default ProtocolSummary;
