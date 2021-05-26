import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ProtocolSummary from '@app/lib/ProtocolSummary/ProtocolSummary';
import ProtocolSummaryErrorBoundary from '../../Errors/ProtocolSummaryErrorBoundary';

const ProtocolSummaryView = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('print');

    return () => {
      document.documentElement.classList.remove('print');
    };
  });

  useEffect(() => {
    ipcRenderer.once('SUMMARY_DATA', (event, _data) => {
      setData(_data);
    });
  }, []);

  return (
    <ProtocolSummaryErrorBoundary>
      <ProtocolSummary data={data} />
    </ProtocolSummaryErrorBoundary>
  );
};

export default ProtocolSummaryView;
