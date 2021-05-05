import React from 'react';
import Codebook from './components/Codebook';
import Stages from './components/Stages';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';

const ProtocolSummary = ({ protocol }) => {
  if (!protocol) { return null; }

  const index = getCodebookIndex(protocol);

  return (
    <SummaryContext.Provider value={{ protocol, index }}>
      <div style={{ position: 'absolute', zIndex: 1000000, top: 0, left: 0, height: 2000, width: '100%', background: '#ffffff' }}>
        <h1>Protocol Summary</h1>

        <Stages />

        <Codebook />

      </div>
    </SummaryContext.Provider>
  );
};

export default ProtocolSummary;
