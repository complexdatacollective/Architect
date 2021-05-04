import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { remote } from 'electron';
import path from 'path';
import fse from 'fs-extra';
import os from 'os';
import ProtocolSummary from '@app/lib/ProtocolSummary/ProtocolSummary';
import { getActiveProtocol } from '@selectors/session';

const print = () => {
  const win = remote.BrowserWindow.getFocusedWindow();

  win.webContents.printToPDF({}).then((data) => {
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf');
    fse.writeFile(pdfPath, data, (error) => {
      if (error) { throw error; }
      console.log(`Wrote PDF successfully to ${pdfPath}`);
    });
  }).catch((error) => {
    console.log(`Failed to write PDF to ${pdfPath}: `, error);
  });
};

const ProtocolSummaryView = () => {
  // useEffect(() => {
  //   print();
  // }, []);

  useEffect(() => {
    ipcRenderer.on('SUMMARY_DATA', (data) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    document.body.classList.add('print');

    return () => {
      document.body.classList.remove('print');
    };
  });

  const state = useSelector((s) => s);
  console.log({ state });

  return (
    <div>
      <ProtocolSummary />
    </div>
  );
};

export default ProtocolSummaryView;
