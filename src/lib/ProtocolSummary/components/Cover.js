import React, { useContext } from 'react';
import path from 'path';
import { DateTime } from 'luxon';
import networkCanvasLogo from '@app/images/NC-Mark.svg';
import SummaryContext from './SummaryContext';

const Cover = () => {
  const {
    protocol,
    filePath,
  } = useContext(SummaryContext);

  const lastModified = DateTime.fromISO(protocol.lastModified).toHTTP();

  return (
    <div className="protocol-summary-cover">
      <div className="protocol-summary-cover__brand">
        <img src={networkCanvasLogo} alt="A Network Canvas project" />
        <h2>Network Canvas</h2>
      </div>
      <div className="protocol-summary-cover__heading">
        <h1>{path.basename(filePath)}</h1>
        <h2>{protocol.description}</h2>
        <p>{`Last Modified: ${lastModified}`}</p>
        <p>{`Protocol schema: v${protocol.schemaVersion}`}</p>
      </div>
    </div>
  );
};

export default Cover;
