import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Cover from './components/Cover';
import Contents from './components/Contents';
import Codebook from './components/Codebook';
import Stages from './components/Stages';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';

const print = () => {
  window.print();
};

const ProtocolSummary = ({ data }) => {
  if (!data) { return null; }

  const { protocol, filePath } = data;

  const index = getCodebookIndex(protocol);

  return (
    <SummaryContext.Provider value={{ protocol, filePath, index }}>
      <div className="protocol-summary-controls">
        <Button onClick={print}>Print</Button>
      </div>
      <div className="protocol-summary">
        <div className="protocol-summary__cover">
          <Cover />
        </div>

        <div className="protocol-summary__contents">
          <Contents />
        </div>

        <div className="protocol-summary__stages">
          <Stages />
        </div>

        <div className="protocol-summary__codebook">
          <Codebook />
        </div>

      </div>
    </SummaryContext.Provider>
  );
};

ProtocolSummary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
};

ProtocolSummary.defaultProps = {
  data: {},
};

export default ProtocolSummary;
