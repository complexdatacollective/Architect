import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { saveDialog } from '@app/utils/dialogs';
import Cover from './components/Cover';
import Contents from './components/Contents';
import Stages from './components/Stages';
import Codebook from './components/Codebook';
import AssetManifest from './components/AssetManifest';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';

// Create a formatted date string that can be used in a filename (no illegal chars)
const formattedNow = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`.replace(/[^a-zA-Z\d\s]/gi, '-').toLowerCase();
};

const ProtocolSummary = ({ data }) => {
  if (!data) { return null; }

  const { protocol, filePath, ...rest } = data;

  const index = getCodebookIndex(protocol);

  const fileName = `${path.basename(filePath, '.netcanvas')} Protocol Summary (Created ${formattedNow()}).pdf`;

  const printPDF = async () => {
    const options = {
      // printBackground: true,
      // landscape: true,
      // marginsType: 1,
    };

    const wc = remote.getCurrentWebContents();

    try {
      const { canceled, filePath: userFilePath } = await saveDialog({
        buttonLabel: 'Save',
        nameFieldLabel: 'Save:',
        defaultPath: fileName,
        filters: [{ extensions: ['pdf'] }],
      });

      if (canceled || !userFilePath) {
        return;
      }

      const pdf = await wc.printToPDF(options);
      await fs.writeFile(userFilePath, pdf);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error saving file: ', error);
    }
  };

  const print = () => {
    window.document.title = fileName;
    window.print();
  };

  return (
    <SummaryContext.Provider value={{
      protocol, filePath, index, ...rest,
    }}
    >
      <div className="protocol-summary">
        <div className="protocol-summary__cover page-break-marker">
          <Cover />
        </div>

        <div className="protocol-summary__contents page-break-marker">
          <Contents />
        </div>

        <div className="protocol-summary__stages">
          <Stages />
        </div>

        <div className="protocol-summary__codebook">
          <Codebook />
        </div>

        <div className="protocol-summary__manifest">
          <AssetManifest />
        </div>
      </div>
      <div className="protocol-summary-controls">
        <Button color="platinum" onClick={printPDF}>Save PDF</Button>
        &nbsp;
        <Button onClick={print}>Print</Button>
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
