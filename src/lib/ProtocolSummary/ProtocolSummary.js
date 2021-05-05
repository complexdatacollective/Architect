import React from 'react';
import Codebook from './components/Codebook';
import Stages from './components/Stages';
import { getCodebookIndex } from './helpers';

const ProtocolSummary = ({ protocol }) => {
  if (!protocol) { return null; }

  console.log({ protocol });

  const {
    stages = [],
  } = protocol;

  const codebook = getCodebookIndex(protocol);

  return (
    <div style={{ position: 'absolute', zIndex: 1000000, top: 0, left: 0, height: 2000, width: '100%', background: '#ffffff' }}>
      <h1>Protocol Summary</h1>

      <Stages stages={stages} codebook={codebook} />

      <Codebook codebook={codebook} />

    </div>
  );
};

export default ProtocolSummary;
