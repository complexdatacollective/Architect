import React from 'react';
import PropTypes from 'prop-types';
import Codebook from './components/Codebook';
import Stages from './components/Stages';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';
import './ProtocolSummary.scss';

const ProtocolSummary = ({ protocol }) => {
  if (!protocol) { return null; }

  const index = getCodebookIndex(protocol);

  console.log({ protocol });

  return (
    <SummaryContext.Provider value={{ protocol, index }}>
      <div className="printable-summary">
        <div className="printable-summary__heading">
          <h1>Protocol Summary</h1>
          <h2>{protocol.description}</h2>
        </div>

        <div className="printable-summary__stages">
          <Stages />
        </div>

        <div className="printable-summary__codebook">
          <Codebook />
        </div>

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
