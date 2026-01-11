import React, { useEffect, useState } from 'react';
import { electronAPI } from '@utils/electronBridge';
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
    electronAPI.ipc.once('SUMMARY_DATA', (_data) => {
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
