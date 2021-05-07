import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ProtocolSummary from '@app/lib/ProtocolSummary/ProtocolSummary';

const ProtocolSummaryView = () => {
  const [protocol, setProtocol] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('print');

    return () => {
      document.documentElement.classList.remove('print');
    };
  });

  useEffect(() => {
    ipcRenderer.once('SUMMARY_DATA', (event, data) => {
      setProtocol(data.protocol);
    });
  }, []);

  return (
    <div>
      <ProtocolSummary protocol={protocol} />
    </div>
  );
};

export default ProtocolSummaryView;
