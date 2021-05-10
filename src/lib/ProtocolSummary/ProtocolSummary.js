import React from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import path from 'path';
import fse from 'fs-extra';
import os from 'os';
import Button from '@codaco/ui/lib/components/Button';
import Cover from './components/Cover';
import Contents from './components/Contents';
import Codebook from './components/Codebook';
import Stages from './components/Stages';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';

const print = () => {
  console.log('print');
  const win = remote.BrowserWindow.getFocusedWindow();

  const options = {
    printBackground: true,
    pageSize: 'A4',
  };

  win.webContents.printToPDF(options).then((data) => {
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf');
    fse.writeFile(pdfPath, data, (error) => {
      if (error) { throw error; }
      console.log(`Wrote PDF successfully to ${pdfPath}`);
    });
  }).catch((error) => {
    console.log(`Failed to write PDF to ${pdfPath}: `, error);
  });
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
