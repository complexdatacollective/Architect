import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import { electronAPI } from '@utils/electronBridge';
import { saveDialog } from '@app/utils/dialogs';
import Cover from './components/Cover';
import Contents from './components/Contents';
import Stages from './components/Stages';
import Codebook from './components/Codebook';
import AssetManifest from './components/AssetManifest';
import SummaryContext from './components/SummaryContext';
import { getCodebookIndex } from './helpers';

const closeWindow = () => electronAPI.window.hide();

// Create a formatted date string that can be used in a filename (no illegal chars)
const dateWithSafeChars = (date, replaceWith = '-') => date.replace(/[^a-zA-Z\d\s]/gi, replaceWith).toLowerCase();

const ProtocolSummary = ({ data }) => {
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const computeFileName = async () => {
      if (!data || !data.filePath) return;
      const now = new Date();
      const dateString = `${dateWithSafeChars(now.toLocaleDateString(), '-')} ${dateWithSafeChars(now.toLocaleTimeString(), '.')}`;
      const baseName = await electronAPI.path.basename(data.filePath, '.netcanvas');
      setFileName(`${baseName} Protocol Summary (Created ${dateString}).pdf`);
    };
    computeFileName();
  }, [data]);

  if (!data) { return null; }

  const { protocol, filePath, ...rest } = data;
  const index = getCodebookIndex(protocol);

  const printPDF = async () => {
    const options = {
      // printBackground: true,
      // landscape: true,
      // marginsType: 1,
    };

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

      const pdf = await electronAPI.webContents.printToPDF(options);
      await electronAPI.fs.writeFile(userFilePath, pdf);
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
        <div>
          <Button color="platinum" onClick={closeWindow}>Close Window</Button>
        </div>
        <div className="protocol-summary-controls__print-buttons">
          <Button color="neon-coral" onClick={printPDF}>Save PDF</Button>
          <Button onClick={print}>Print</Button>
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
